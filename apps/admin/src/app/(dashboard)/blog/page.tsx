"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const schema = z.object({
  title:       z.string().min(3, "Title is required"),
  title_ar:    z.string().optional(),
  category_id: z.number().int().positive().optional(),
  excerpt:     z.string().optional(),
  excerpt_ar:  z.string().optional(),
  content:     z.string().min(1, "Content is required"),
  content_ar:  z.string().optional(),
  status:      z.enum(["draft", "published"]),
  tags:        z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function BlogForm({ initial, categories, onSuccess }: { initial?: any; categories: any[]; onSuccess: () => void }) {
  const [lang, setLang] = useState<"en" | "ar">("en");

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title:      initial.title      ?? "",
          title_ar:   initial.title_ar   ?? "",
          excerpt:    initial.excerpt    ?? "",
          excerpt_ar: initial.excerpt_ar ?? "",
          content:    initial.content    ?? "",
          content_ar: initial.content_ar ?? "",
          status:     initial.status     ?? "draft",
          tags:       Array.isArray(initial.tags) ? initial.tags.join(", ") : (initial.tags ?? ""),
          category_id: initial.category_id ?? undefined,
        }
      : { status: "draft", content: "", content_ar: "" },
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    if (initial?.id) await api.put(`/admin/blog/${initial.id}`, payload);
    else await api.post("/admin/blog", payload);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Shared fields: category, status, tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select {...register("category_id", { setValueAs: (v) => (v === "" || v === undefined) ? undefined : Number(v) })} className="input">
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select {...register("status")} className="input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Tags (comma-separated)</label>
        <input {...register("tags")} className="input" placeholder="hajj, mecca, umrah" />
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 border-b border-gray-100">
        {(["en", "ar"] as const).map((l) => (
          <button key={l} type="button" onClick={() => setLang(l)}
            className={cn(
              "px-5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              lang === l ? "border-[#0F6A4A] text-[#0F6A4A]" : "border-transparent text-gray-500 hover:text-gray-700"
            )}>
            {l === "en" ? "English" : "عربي (Arabic)"}
          </button>
        ))}
      </div>

      {/* English fields */}
      {lang === "en" && (
        <div className="space-y-4">
          <div>
            <label className="label">Title (English)</label>
            <input {...register("title")} className="input" placeholder="Blog post title" />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Excerpt (English)</label>
            <input {...register("excerpt")} className="input" placeholder="Short summary shown in listings…" />
          </div>
          <div>
            <label className="label">Content (English)</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Write your article here…"
                />
              )}
            />
            {errors.content && <p className="error">{errors.content.message}</p>}
          </div>
        </div>
      )}

      {/* Arabic fields */}
      {lang === "ar" && (
        <div className="space-y-4">
          <div>
            <label className="label">العنوان (Title in Arabic)</label>
            <input {...register("title_ar")} className="input text-right" dir="rtl" placeholder="عنوان المقالة" />
          </div>
          <div>
            <label className="label">الملخص (Excerpt in Arabic)</label>
            <input {...register("excerpt_ar")} className="input text-right" dir="rtl" placeholder="ملخص قصير…" />
          </div>
          <div>
            <label className="label">المحتوى (Content in Arabic)</label>
            <Controller
              name="content_ar"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  dir="rtl"
                  placeholder="اكتب المقالة هنا…"
                />
              )}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : initial ? "Update Post" : "Publish Post"}
        </Button>
      </div>
    </form>
  );
}

export default function BlogPage() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filter, setFilter] = useState({ search: "", status: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["blog", filter],
    queryFn: () => api.get("/admin/blog", { params: filter }).then((r) => r.data),
  });

  const { data: cats } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => api.get("/admin/blog-categories").then((r) => r.data.data),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/blog/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog"] }),
  });

  const columns = [
    { header: "Title", accessor: (r: any) => <div><p className="font-medium truncate max-w-[260px]">{r.title}</p><p className="text-xs text-gray-400">{r.slug}</p></div> },
    { header: "Category", accessor: (r: any) => r.category?.name ?? <span className="text-gray-300">—</span> },
    { header: "Status", accessor: (r: any) => <Badge variant={r.status === "published" ? "success" : "warning"}>{r.status}</Badge> },
    { header: "Views", accessor: "views_count" as any },
    { header: "Published", accessor: (r: any) => r.published_at ? formatDate(r.published_at) : "—" },
    {
      header: "Actions", accessor: (r: any) => (
        <div className="flex gap-1.5">
          <button onClick={() => { setEditing(r); setFormOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={() => confirm("Delete?") && destroy.mutate(r.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="w-4 h-4" /> New Post</Button>
      </div>
      <div className="flex gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
        <input type="text" placeholder="Search posts…" value={filter.search}
          onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400" />
        <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          className="text-sm text-gray-600 border-l border-gray-200 pl-3 outline-none bg-transparent">
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <DataTable columns={columns as any} data={data?.data ?? []} loading={isLoading} />
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Post" : "New Post"} width="lg">
        <BlogForm
          initial={editing}
          categories={cats ?? []}
          onSuccess={() => { setFormOpen(false); qc.invalidateQueries({ queryKey: ["blog"] }); }}
        />
      </Modal>
    </div>
  );
}
