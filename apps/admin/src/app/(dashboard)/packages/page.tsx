"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, PACKAGE_TYPE_LABELS } from "@/lib/utils";
import { Plus, Pencil, Trash2, RotateCcw } from "lucide-react";
import PackageForm from "@/components/packages/PackageForm";

export default function PackagesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ type: "", status: "", search: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["packages", filter],
    queryFn: () => api.get("/admin/packages", { params: filter }).then((r) => r.data),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/packages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });

  const restore = useMutation({
    mutationFn: (id: number) => api.post(`/admin/packages/${id}/restore`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (pkg: any) => { setEditing(pkg); setFormOpen(true); };

  const packages = data?.data ?? [];

  const columns = [
    { header: "Title", accessor: (r: any) => (
      <div>
        <p className="font-medium text-gray-900 truncate max-w-[220px]">{r.title}</p>
        <p className="text-xs text-gray-400">{r.slug}</p>
      </div>
    )},
    { header: "Type", accessor: (r: any) => (
      <Badge variant={r.type === "hajj" ? "gold" : r.type === "umrah" ? "success" : "info"}>
        {PACKAGE_TYPE_LABELS[r.type] ?? r.type}
      </Badge>
    )},
    { header: "Status", accessor: (r: any) => (
      <Badge variant={r.status === "published" ? "success" : r.status === "draft" ? "warning" : "danger"}>
        {r.status}
      </Badge>
    )},
    { header: "Price from", accessor: (r: any) => formatCurrency(r.base_price) },
    { header: "Seats", accessor: (r: any) => `${r.seats_booked}/${r.total_seats}` },
    { header: "Updated", accessor: (r: any) => formatDate(r.updated_at) },
    { header: "Actions", accessor: (r: any) => (
      <div className="flex items-center gap-1.5">
        <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {r.deleted_at ? (
          <button onClick={() => restore.mutate(r.id)} className="p-1.5 rounded hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 transition-colors" title="Restore">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={() => { if (confirm("Delete this package?")) destroy.mutate(r.id); }}
            className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage Hajj, Umrah and tour packages</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> New Package</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
        <input
          type="text"
          placeholder="Search packages…"
          value={filter.search}
          onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
        />
        <select value={filter.type} onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
          className="text-sm text-gray-600 border-l border-gray-200 pl-3 outline-none bg-transparent">
          <option value="">All Types</option>
          <option value="hajj">Hajj</option>
          <option value="umrah">Umrah</option>
          <option value="local">Local Tours</option>
          <option value="international">International</option>
        </select>
        <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          className="text-sm text-gray-600 border-l border-gray-200 pl-3 outline-none bg-transparent">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <DataTable columns={columns as any} data={packages} loading={isLoading} />

      {/* Pagination */}
      {data?.meta && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {data.meta.from}–{data.meta.to} of {data.meta.total}</span>
          <div className="flex gap-2">
            {Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map((p) => (
              <button key={p} disabled={p === data.meta.current_page}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === data.meta.current_page ? "bg-[#0F6A4A] text-white" : "hover:bg-gray-100"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Package" : "New Package"} width="xl">
        <PackageForm initial={editing} onSuccess={() => { setFormOpen(false); qc.invalidateQueries({ queryKey: ["packages"] }); }} />
      </Modal>
    </div>
  );
}
