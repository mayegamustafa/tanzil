"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Trash2, Download } from "lucide-react";

export default function NewsletterPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["newsletter"],
    queryFn: () => api.get("/admin/newsletter").then((r) => r.data),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/newsletter/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["newsletter"] }),
  });

  const exportCsv = () => {
    const rows = (data?.data ?? []).map((s: any) => [s.email, s.name ?? "", s.created_at].join(","));
    const csv = ["email,name,subscribed_at", ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "subscribers.csv"; a.click();
  };

  const columns = [
    { header: "Email", accessor: "email" as any },
    { header: "Name", accessor: (r: any) => r.name ?? "—" },
    { header: "Status", accessor: (r: any) => <Badge variant={r.is_active ? "success" : "warning"}>{r.is_active ? "Subscribed" : "Unsubscribed"}</Badge> },
    { header: "Joined", accessor: (r: any) => formatDate(r.created_at) },
    { header: "", accessor: (r: any) => (
      <button onClick={() => confirm("Remove subscriber?") && destroy.mutate(r.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.meta?.total ?? 0} subscribers</p>
        </div>
        <Button variant="secondary" onClick={exportCsv}><Download className="w-4 h-4" /> Export CSV</Button>
      </div>
      <DataTable columns={columns as any} data={data?.data ?? []} loading={isLoading} />
    </div>
  );
}
