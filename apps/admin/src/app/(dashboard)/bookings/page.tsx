"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, BOOKING_STATUS_COLORS } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";

const STATUS_OPTIONS = ["pending", "approved", "processing", "paid", "cancelled", "completed"];

export default function BookingsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ status: "", search: "", page: 1 });
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", filter],
    queryFn: () => api.get("/admin/bookings", { params: filter }).then((r) => r.data),
  });

  const { data: detail } = useQuery({
    queryKey: ["booking", selected?.id],
    queryFn: () => api.get(`/admin/bookings/${selected.id}`).then((r) => r.data.data),
    enabled: !!selected?.id,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/admin/bookings/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const downloadInvoice = async (id: number, ref: string) => {
    const res = await api.get(`/admin/bookings/${id}/invoice`, { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const a = document.createElement("a"); a.href = url; a.download = `invoice-${ref}.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const bookings = data?.data ?? [];

  const columns = [
    { header: "Reference", accessor: (r: any) => <span className="font-mono text-xs font-semibold text-gray-700">{r.reference}</span> },
    { header: "Passenger", accessor: (r: any) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{r.lead_passenger_name}</p>
        <p className="text-xs text-gray-400">{r.lead_passenger_email}</p>
      </div>
    )},
    { header: "Package", accessor: (r: any) => <span className="truncate max-w-[160px] block">{r.package?.title ?? "—"}</span> },
    { header: "Pax", accessor: (r: any) => r.passenger_count },
    { header: "Total", accessor: (r: any) => formatCurrency(r.total_amount, r.currency) },
    { header: "Status", accessor: (r: any) => (
      <select value={r.status} onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })}
        className={`text-xs font-medium rounded-full px-2 py-1 border-0 outline-none cursor-pointer ${BOOKING_STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-700"}`}>
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
    { header: "Date", accessor: (r: any) => formatDate(r.created_at) },
    { header: "Actions", accessor: (r: any) => (
      <div className="flex items-center gap-1.5">
        <button onClick={() => setSelected(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="View"><Eye className="w-3.5 h-3.5" /></button>
        <button onClick={() => downloadInvoice(r.id, r.reference)} className="p-1.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600" title="Invoice"><FileText className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.meta?.total ?? 0} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
        <input type="text" placeholder="Search by name, email or reference…"
          value={filter.search} onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value, page: 1 }))}
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400" />
        <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value, page: 1 }))}
          className="text-sm text-gray-600 border-l border-gray-200 pl-3 outline-none bg-transparent">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <DataTable columns={columns as any} data={bookings} loading={isLoading} />

      {/* Detail modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`Booking — ${selected.reference}`} width="lg">
          {detail ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-gray-500">Lead Passenger</span><p className="font-medium">{detail.lead_passenger_name}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium">{detail.lead_passenger_email}</p></div>
                <div><span className="text-gray-500">Phone</span><p className="font-medium">{detail.lead_passenger_phone}</p></div>
                <div><span className="text-gray-500">Total</span><p className="font-semibold text-[#0F6A4A]">{formatCurrency(detail.total_amount, detail.currency)}</p></div>
                {detail.discount_amount > 0 && (
                  <div><span className="text-gray-500">Discount</span><p className="text-red-600">-{formatCurrency(detail.discount_amount, detail.currency)}</p></div>
                )}
              </div>

              {detail.passengers?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Passengers</h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>{["Name","Passport","Nationality","DOB"].map((h) => <th key={h} className="px-3 py-2 text-left text-gray-500 font-medium">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {detail.passengers.map((p: any) => (
                          <tr key={p.id}>
                            <td className="px-3 py-2">{p.first_name} {p.last_name}</td>
                            <td className="px-3 py-2 font-mono">{p.passport_number}</td>
                            <td className="px-3 py-2">{p.nationality}</td>
                            <td className="px-3 py-2">{p.date_of_birth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : <div className="h-24 flex items-center justify-center"><div className="w-6 h-6 border-4 border-[#0F6A4A] border-t-transparent rounded-full animate-spin" /></div>}
        </Modal>
      )}
    </div>
  );
}
