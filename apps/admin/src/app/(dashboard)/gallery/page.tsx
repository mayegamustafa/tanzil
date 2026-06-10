"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";

export default function GalleryPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [albumName, setAlbumName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => api.get("/admin/gallery").then((r) => r.data.data),
  });

  const createAlbum = useMutation({
    mutationFn: () => api.post("/admin/gallery", { name: albumName }),
    onSuccess: () => { setCreating(false); setAlbumName(""); qc.invalidateQueries({ queryKey: ["gallery"] }); },
  });

  const destroyAlbum = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/gallery/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });

  const columns = [
    { header: "Album Name", accessor: (r: any) => <p className="font-medium">{r.name}</p> },
    { header: "Slug", accessor: (r: any) => <span className="text-gray-400 text-xs font-mono">{r.slug}</span> },
    { header: "Items", accessor: (r: any) => r.item_count ?? 0 },
    { header: "Created", accessor: (r: any) => formatDate(r.created_at) },
    { header: "Actions", accessor: (r: any) => (
      <div className="flex gap-1.5">
        <button onClick={() => setSelected(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Eye className="w-3.5 h-3.5" /></button>
        <button onClick={() => confirm("Delete album?") && destroyAlbum.mutate(r.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <Button onClick={() => setCreating(true)}><Plus className="w-4 h-4" /> New Album</Button>
      </div>
      <DataTable columns={columns as any} data={data ?? []} loading={isLoading} />

      {/* Create Album Modal */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Create Album">
        <div className="space-y-4">
          <div>
            <label className="label">Album Name</label>
            <input value={albumName} onChange={(e) => setAlbumName(e.target.value)} className="input" placeholder="e.g. Hajj 2024" />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => createAlbum.mutate()} disabled={!albumName || createAlbum.isPending}>
              {createAlbum.isPending ? "Creating…" : "Create Album"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Album detail */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.name} width="lg">
          <AlbumItems albumId={selected.id} />
        </Modal>
      )}
    </div>
  );
}

function AlbumItems({ albumId }: { albumId: number }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["gallery-items", albumId],
    queryFn: () => api.get(`/admin/gallery/${albumId}`).then((r) => r.data.data),
  });
  const remove = useMutation({
    mutationFn: (itemId: number) => api.delete(`/admin/gallery/${albumId}/items/${itemId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery-items", albumId] }),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No items in this album yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {items.map((item: any) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
              <img src={item.url} alt={item.caption ?? ""} className="w-full h-full object-cover" />
              <button onClick={() => remove.mutate(item.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 text-center">Upload images via the Media Library when adding packages.</p>
    </div>
  );
}
