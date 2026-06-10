"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().optional(),
  is_active: z.boolean(),
});
type FormData = z.infer<typeof schema>;

function FaqForm({ initial, onSuccess }: { initial?: any; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { is_active: true },
  });
  const onSubmit = async (data: FormData) => {
    if (initial?.id) await api.put(`/admin/faqs/${initial.id}`, data);
    else await api.post("/admin/faqs", data);
    onSuccess();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label className="label">Question</label><input {...register("question")} className="input" />{errors.question && <p className="error">{errors.question.message}</p>}</div>
      <div><label className="label">Answer</label><textarea {...register("answer")} rows={5} className="input resize-none" />{errors.answer && <p className="error">{errors.answer.message}</p>}</div>
      <div><label className="label">Category (optional)</label><input {...register("category")} className="input" placeholder="e.g. Visa, Hajj, Payments" /></div>
      <div className="flex items-center gap-2"><input {...register("is_active")} type="checkbox" id="faq_active" className="w-4 h-4 accent-[#0F6A4A]" /><label htmlFor="faq_active" className="text-sm text-gray-700">Active</label></div>
      <div className="flex justify-end pt-2 border-t border-gray-100"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : initial ? "Update FAQ" : "Add FAQ"}</Button></div>
    </form>
  );
}

export default function FaqsPage() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => api.get("/admin/faqs").then((r) => r.data.data),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/faqs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const columns = [
    { header: "", accessor: () => <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" /> },
    { header: "Question", accessor: (r: any) => <p className="font-medium text-sm max-w-[300px] truncate">{r.question}</p> },
    { header: "Category", accessor: (r: any) => r.category ?? "—" },
    { header: "Status", accessor: (r: any) => <Badge variant={r.is_active ? "success" : "warning"}>{r.is_active ? "Active" : "Hidden"}</Badge> },
    { header: "Actions", accessor: (r: any) => (
      <div className="flex gap-1.5">
        <button onClick={() => { setEditing(r); setFormOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => confirm("Delete?") && destroy.mutate(r.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="w-4 h-4" /> Add FAQ</Button>
      </div>
      <DataTable columns={columns as any} data={data ?? []} loading={isLoading} />
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit FAQ" : "New FAQ"}>
        <FaqForm initial={editing} onSuccess={() => { setFormOpen(false); qc.invalidateQueries({ queryKey: ["faqs"] }); }} />
      </Modal>
    </div>
  );
}
