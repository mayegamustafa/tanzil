"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatCurrency, PACKAGE_TYPE_LABELS } from "@/lib/utils";
import { Calendar, Users, ArrowRight, MapPin } from "lucide-react";

const TABS = [
  { label: "All",            value: "" },
  { label: "Hajj",           value: "hajj" },
  { label: "Umrah",          value: "umrah" },
  { label: "Local Tours",    value: "local" },
  { label: "International",  value: "international" },
];

function PackageSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <div className="h-56 skeleton" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-16 skeleton rounded-full" />
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-2/3 skeleton rounded" />
        <div className="h-10 skeleton rounded-xl mt-4" />
      </div>
    </div>
  );
}

function PackageCard({ pkg, index }: { pkg: any; index: number }) {
  const typeHref = ["local", "international"].includes(pkg.type) ? "tours" : pkg.type;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.45 }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100/80 shadow-sm card-hover group">

      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#0A4F38] to-[#1a8060]">
        {pkg.gallery?.[0] || pkg.thumbnail ? (
          <img
            src={pkg.gallery?.[0] ?? pkg.thumbnail}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 border-2 border-white/20 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 border border-white/30 rounded-full" />
            </div>
          </div>
        )}
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span className="badge-pill bg-[#C8A96B] text-white">
            {PACKAGE_TYPE_LABELS[pkg.type] ?? pkg.type}
          </span>
        </div>
        {pkg.is_featured && (
          <div className="absolute top-4 right-4">
            <span className="badge-pill bg-white/90 text-[#0F6A4A]">
              <svg className="w-3 h-3 fill-[#C8A96B]" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Featured
            </span>
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-right">
            <p className="text-white/60 text-[10px] leading-none">From</p>
            <p className="text-white font-bold text-base leading-tight mt-0.5">
              {formatCurrency(pkg.base_price, pkg.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[0.95rem] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#0F6A4A] transition-colors line-clamp-2">
          {pkg.title}
        </h3>
        {(pkg.excerpt || pkg.short_description) && (
          <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
            {pkg.excerpt ?? pkg.short_description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {pkg.duration_days}d
          </span>
          {pkg.seats_available != null && (
            <>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {pkg.seats_available} left
              </span>
            </>
          )}
          {pkg.departure_city && (
            <>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {pkg.departure_city}
              </span>
            </>
          )}
        </div>

        <Link
          href={`/${typeHref}/${pkg.slug}`}
          className="group/btn flex items-center justify-between w-full bg-[#0F6A4A]/6 hover:bg-[#0F6A4A] border border-[#0F6A4A]/20 hover:border-[#0F6A4A] rounded-xl px-4 py-2.5 transition-all">
          <span className="text-sm font-semibold text-[#0F6A4A] group-hover/btn:text-white transition-colors">
            View Details
          </span>
          <ArrowRight className="w-4 h-4 text-[#0F6A4A] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedPackages() {
  const [activeTab, setActiveTab] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["featured-packages", activeTab],
    queryFn: () =>
      api
        .get("/packages", {
          params: {
            featured: true,
            per_page: 6,
            ...(activeTab ? { type: activeTab } : {}),
          },
        })
        .then((r) => r.data.data),
  });

  const packages: any[] = data ?? [];

  return (
    <section className="py-20 lg:py-28 bg-[#F8F5EE]">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="section-label text-[#0F6A4A] mb-4 block">
              Our Packages
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
              Featured Journeys
            </motion.h2>
            <div className="divider-gold mt-4" />
          </div>
          <Link
            href="/hajj"
            className="hidden lg:inline-flex items-center gap-2 text-[#0F6A4A] font-semibold text-sm border border-[#0F6A4A]/30 hover:border-[#0F6A4A] hover:bg-[#0F6A4A] hover:text-white px-5 py-2.5 rounded-xl transition-all">
            All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 -mx-1 px-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.value
                  ? "bg-[#0F6A4A] text-white shadow-md shadow-[#0F6A4A]/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#0F6A4A]/40 hover:text-[#0F6A4A]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <PackageSkeleton key={i} />)
              : packages.map((pkg: any, i: number) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} />
                ))}
            {!isLoading && packages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-3 text-center py-16 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="font-medium">No packages found</p>
                <p className="text-sm mt-1">Check back soon for new packages</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mobile CTA */}
        <div className="text-center mt-10 lg:hidden">
          <Link
            href="/hajj"
            className="inline-flex items-center gap-2 border-2 border-[#0F6A4A] text-[#0F6A4A] hover:bg-[#0F6A4A] hover:text-white font-semibold px-8 py-3.5 rounded-2xl transition-all">
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
