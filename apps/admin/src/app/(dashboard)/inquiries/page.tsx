"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";

const STATUS_OPTIONS = ["new", "in_progress", "resolved", "closed"];

export default function InquiriesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ status: "", search: "" });
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["inquiries", filter],
    queryFn: () => api.get("/admin/inquiries", { params: filter }).then((r) => r.data),
  });

  const { data: detail } = useQuery({
    queryKey: ["inquiry", selected?.id],
    queryFn: () => api.get(`/admin/inquiries/${selected.id}`).then((r) => r.data.data),
    enabled: !!selected?.id,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.put(`/admin/inquiries/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });

  const columns = [
    { header: "Name", accessor: (r: any) => <p className="font-medium">{r.name}</p> },
    { header: "Email", accessor: "email" as any },
    { header: "Subject", accessor: (r: any) => <p className="truncate max-w-[200px] text-gray-600">{r.subject}</p> },
    { header: "Package", accessor: (r: any) => r.package?.title ?? "—" },
    { header: "Status", accessor: (r: any) => (
      <select value={r.status} onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })}
        className="text-xs font-medium rounded-full px-2 py-1 border border-gray-200 outline-none bg-white cursor-pointer">
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
      </select>
    )},
    { header: "Date", accessor: (r: any) => formatDate(r.created_at) },
    { header: "", accessor: (r: any) => (
      <button onClick={() => setSelected(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Eye className="w-3.5 h-3.5" /></button>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
      </div>
      <div className="flex gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
        <input type="text" placeholder="Search…" value={filter.search} onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))} className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400" />
        <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))} className="text-sm text-gray-600 border-l border-gray-200 pl-3 outline-none bg-transparent">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>
      <DataTable columns={columns as any} data={data?.data ?? []} loading={isLoading} />

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`Inquiry — ${selected.name}`} width="md">
          {detail ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">Name</span><p className="font-medium">{detail.name}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium">{detail.email}</p></div>
                {detail.phone && <div><span className="text-gray-500">Phone</span><p>{detail.phone}</p></div>}
                {detail.package && <div><span className="text-gray-500">Package</span><p>{detail.package.title}</p></div>}
              </div>
              <div>
                <span className="text-gray-500">Subject</span>
                <p className="font-medium mt-0.5">{detail.subject}</p>
              </div>
              <div>
                <span className="text-gray-500">Message</span>
                <p className="mt-0.5 leading-relaxed text-gray-700 whitespace-pre-wrap">{detail.message}</p>
              </div>
            </div>
          ) : <div className="h-24 flex items-center justify-center"><div className="w-6 h-6 border-4 border-[#0F6A4A] border-t-transparent rounded-full animate-spin" /></div>}
        </Modal>
      )}
    </div>
  );
}
