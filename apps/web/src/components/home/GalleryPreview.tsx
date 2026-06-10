"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

// Mosaic size classes for a 4-column grid
const SIZES = [
  "col-span-2 row-span-2", // big feature
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2", // tall
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export default function GalleryPreview() {
  const { data } = useQuery({
    queryKey: ["gallery-public"],
    queryFn: () => api.get("/gallery").then((r) => r.data.data),
  });

  const albums = data ?? [];
  const allItems = albums.flatMap((a: any) => a.items ?? []).slice(0, 7);

  if (allItems.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#F8F5EE]">
      <div className="container-site">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label text-[#0F6A4A] mb-4 block">Gallery</span>
            <h2
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
              Our Gallery
            </h2>
            <div className="divider-gold mt-4" />
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-2 text-[#0F6A4A] font-semibold text-sm border border-[#0F6A4A]/30 hover:border-[#0F6A4A] hover:bg-[#0F6A4A] hover:text-white px-5 py-2.5 rounded-xl transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-4 grid-rows-3 gap-3 h-[480px] lg:h-[540px]">
          {allItems.map((item: any, i: number) => (
            <motion.div
              key={item.id ?? i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className={`relative overflow-hidden rounded-2xl bg-gray-200 group cursor-pointer ${
                SIZES[i] ?? "col-span-1 row-span-1"
              }`}>
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.caption ?? "Gallery"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F6A4A]/20 to-[#C8A96B]/10">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium">{item.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-[#0F6A4A] font-semibold">
            View full gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
