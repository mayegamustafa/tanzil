"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2),
  location: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10),
  status: z.enum(["pending", "approved", "rejected"]),
});
type FormData = z.infer<typeof schema>;

function TestimonialForm({ initial, onSuccess }: { initial?: any; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { rating: 5, status: "pending" },
  });
  const onSubmit = async (data: FormData) => {
    if (initial?.id) await api.put(`/admin/testimonials/${initial.id}`, data);
    else await api.post("/admin/testimonials", data);
    onSuccess();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Name</label><input {...register("name")} className="input" />{errors.name && <p className="error">{errors.name.message}</p>}</div>
        <div><label className="label">Location</label><input {...register("location")} className="input" placeholder="e.g. Kampala, Uganda" /></div>
        <div>
          <label className="label">Rating</label>
          <select {...register("rating", { setValueAs: (v) => Number(v) })} className="input">
            {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} stars</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select {...register("status")} className="input">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div><label className="label">Review Content</label><textarea {...register("content")} rows={4} className="input resize-none" />{errors.content && <p className="error">{errors.content.message}</p>}</div>
      <div className="flex justify-end pt-2 border-t border-gray-100"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : initial ? "Update" : "Add Testimonial"}</Button></div>
    </form>
  );
}

export default function TestimonialsPage() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => api.get("/admin/testimonials").then((r) => r.data.data),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });

  const columns = [
    { header: "Name", accessor: (r: any) => <p className="font-medium">{r.name}</p> },
    { header: "Location", accessor: (r: any) => r.location ?? "—" },
    { header: "Rating", accessor: (r: any) => (
      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[#C8A96B] text-[#C8A96B]" : "text-gray-200"}`} />)}</div>
    )},
    { header: "Status", accessor: (r: any) => <Badge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"}>{r.status}</Badge> },
    { header: "Content", accessor: (r: any) => <p className="text-gray-500 text-xs truncate max-w-[240px]">{r.content}</p> },
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
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="w-4 h-4" /> Add Testimonial</Button>
      </div>
      <DataTable columns={columns as any} data={data ?? []} loading={isLoading} />
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Testimonial" : "New Testimonial"}>
        <TestimonialForm initial={editing} onSuccess={() => { setFormOpen(false); qc.invalidateQueries({ queryKey: ["testimonials"] }); }} />
      </Modal>
    </div>
  );
}
