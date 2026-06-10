"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: albums = [], isLoading } = useQuery({
    queryKey: ["gallery-all"],
    queryFn: () => api.get("/gallery").then((r) => r.data.data),
  });

  const currentAlbum = activeAlbum !== null ? albums.find((a: any) => a.id === activeAlbum) : null;
  const displayItems = currentAlbum ? currentAlbum.items ?? [] : albums.flatMap((a: any) => a.items ?? []);

  return (
    <>
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
          Our Gallery
        </h1>
        <p className="text-white/70 max-w-xl mx-auto">Moments captured from pilgrimages, tours, and sacred journeys</p>
      </div>

      <div className="py-12 bg-[#F8F5EE]">
        <div className="container-site">
          {/* Album tabs */}
          {albums.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button onClick={() => setActiveAlbum(null)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeAlbum === null ? "bg-[#0F6A4A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                All
              </button>
              {albums.map((album: any) => (
                <button key={album.id} onClick={() => setActiveAlbum(album.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeAlbum === album.id ? "bg-[#0F6A4A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {album.name}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center py-24"><p className="text-gray-400 text-lg">No images yet.</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayItems.map((item: any, i: number) => (
                <motion.div key={item.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setLightbox(item.url)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer group">
                  <img src={item.url} alt={item.caption ?? "Gallery"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <img src={lightbox} alt="Gallery" className="max-h-[90vh] max-w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
