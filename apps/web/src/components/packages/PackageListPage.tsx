"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrency, PACKAGE_TYPE_LABELS } from "@/lib/utils";
import { Calendar, Users, MapPin, Search, ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/lib/cms";

interface PackageListPageProps {
  type: string;
  title: string;
  subtitle: string;
  settings: SiteSettings;
}

export default function PackageListPage({ type, title, subtitle }: PackageListPageProps) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["packages-public", type, search],
    queryFn: () => api.get("/packages", { params: { type, search, per_page: 12 } }).then((r) => r.data),
  });

  const packages = data?.data ?? [];

  return (
    <>
      {/* Page hero */}
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20">
        <div className="container-site text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-white/70 max-w-2xl mx-auto text-base mb-8">
            {subtitle}
          </motion.p>
          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages…"
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm text-gray-700 outline-none shadow-lg placeholder:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="py-16 bg-[#F8F5EE]">
        <div className="container-site">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-100" />
                  <div className="p-6 space-y-3"><div className="h-5 w-3/4 bg-gray-100 rounded" /><div className="h-4 w-full bg-gray-100 rounded" /></div>
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">No packages found.</p>
              <p className="text-gray-300 text-sm mt-2">Check back soon or contact us for custom packages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {packages.map((pkg: any, i: number) => (
                <motion.div key={pkg.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-52 bg-gradient-to-br from-[#0F6A4A] to-[#1a8060]">
                    {pkg.gallery?.[0] && <img src={pkg.gallery[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#C8A96B] text-white text-xs font-semibold px-3 py-1 rounded-full">{PACKAGE_TYPE_LABELS[pkg.type] ?? pkg.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0F6A4A] transition-colors">{pkg.title}</h3>
                    {pkg.short_description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pkg.short_description}</p>}
                    <div className="flex gap-4 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{pkg.duration_days}d</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{pkg.seats_available} left</span>
                      {pkg.departure_city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{pkg.departure_city}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="text-xl font-bold text-[#0F6A4A]">{formatCurrency(pkg.base_price, pkg.currency)}</p>
                      </div>
                      <Link href={`/${pkg.type}/${pkg.slug}`} className="flex items-center gap-1.5 bg-[#0F6A4A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0A4F38] transition-colors">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
