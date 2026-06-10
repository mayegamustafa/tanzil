"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).optional().or(z.literal("")),
  role: z.enum(["super_admin", "admin", "editor", "agent"]),
  is_active: z.boolean(),
});
type FormData = z.infer<typeof schema>;

function UserForm({ initial, onSuccess }: { initial?: any; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { role: "agent", is_active: true },
  });
  const onSubmit = async (data: FormData) => {
    const payload = { ...data };
    if (!payload.password) delete payload.password;
    if (initial?.id) await api.put(`/admin/users/${initial.id}`, payload);
    else await api.post("/admin/users", payload);
    onSuccess();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="label">Full Name</label><input {...register("name")} className="input" />{errors.name && <p className="error">{errors.name.message}</p>}</div>
        <div><label className="label">Email</label><input {...register("email")} type="email" className="input" />{errors.email && <p className="error">{errors.email.message}</p>}</div>
        <div>
          <label className="label">Role</label>
          <select {...register("role")} className="input">
            <option value="agent">Agent</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div className="col-span-2"><label className="label">{initial ? "New Password (leave blank to keep)" : "Password"}</label><input {...register("password")} type="password" className="input" />{errors.password && <p className="error">{errors.password.message}</p>}</div>
      </div>
      <div className="flex items-center gap-2"><input {...register("is_active")} type="checkbox" id="u_active" className="w-4 h-4 accent-[#0F6A4A]" /><label htmlFor="u_active" className="text-sm text-gray-700">Active account</label></div>
      <div className="flex justify-end pt-2 border-t border-gray-100"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : initial ? "Update User" : "Create User"}</Button></div>
    </form>
  );
}

const ROLE_VARIANTS: Record<string, any> = {
  super_admin: "danger", admin: "gold", editor: "info", agent: "default",
};

export default function UsersPage() {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/admin/users").then((r) => r.data.data),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const columns = [
    { header: "Name", accessor: (r: any) => <p className="font-medium">{r.name}</p> },
    { header: "Email", accessor: "email" as any },
    { header: "Role", accessor: (r: any) => <Badge variant={ROLE_VARIANTS[r.role] ?? "default"}>{r.role.replace("_", " ")}</Badge> },
    { header: "Status", accessor: (r: any) => <Badge variant={r.is_active ? "success" : "warning"}>{r.is_active ? "Active" : "Inactive"}</Badge> },
    { header: "Actions", accessor: (r: any) => (
      <div className="flex gap-1.5">
        {r.id !== me?.id ? (
          <>
            <button onClick={() => { setEditing(r); setFormOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={() => confirm("Delete user?") && destroy.mutate(r.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        ) : <span className="text-xs text-gray-400 px-2">You</span>}
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="w-4 h-4" /> Add User</Button>
      </div>
      <DataTable columns={columns as any} data={data ?? []} loading={isLoading} />
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit User" : "New User"}>
        <UserForm initial={editing} onSuccess={() => { setFormOpen(false); qc.invalidateQueries({ queryKey: ["users"] }); }} />
      </Modal>
    </div>
  );
}
