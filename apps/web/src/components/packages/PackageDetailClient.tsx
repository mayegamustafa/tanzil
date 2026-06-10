"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Users, MapPin, Check, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";

interface PackageDetailClientProps {
  slug: string;
}

export default function PackageDetailClient({ slug }: PackageDetailClientProps) {
  const router = useRouter();
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const { lang } = useLang();

  const { data: pkg, isLoading } = useQuery({
    queryKey: ["package", slug],
    queryFn: () => api.get(`/packages/${slug}`).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 animate-pulse">
        <div className="h-96 bg-gray-100" />
        <div className="container-site py-12 space-y-4">
          <div className="h-8 w-1/2 bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">Package not found</h2><Link href="/" className="text-[#0F6A4A] hover:underline">Back to home</Link></div>
    </div>
  );

  const inclusions = (pkg.inclusions ?? []).filter((i: any) => i.type === "inclusion");
  const exclusions = (pkg.inclusions ?? []).filter((i: any) => i.type === "exclusion");

  const isAr = lang === "ar";
  const title       = (isAr && pkg.title_ar)       ? pkg.title_ar       : pkg.title;
  const description = (isAr && pkg.description_ar) ? pkg.description_ar : pkg.description;

  return (
    <>
      {/* Hero */}
      <div className="relative h-96 bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] overflow-hidden">
        {pkg.gallery?.[0] && <img src={pkg.gallery[0]} alt={title} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 container-site pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#C8A96B] text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">{pkg.type}</span>
            {pkg.is_featured && <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Featured</span>}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white" dir={isAr ? "rtl" : "ltr"}
            style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            {title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F8F5EE] pb-20">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key info */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Calendar, label: "Duration", value: `${pkg.duration_days} days` },
                    { icon: Users, label: "Seats Left", value: pkg.seats_available },
                    { icon: MapPin, label: "Departure", value: pkg.departure_city ?? "TBA" },
                    { icon: Calendar, label: "Departure Date", value: pkg.departure_date ?? "Flexible" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="text-center p-4 rounded-2xl bg-[#F8F5EE]">
                      <Icon className="w-5 h-5 text-[#0F6A4A] mx-auto mb-2" />
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold text-gray-900 text-sm mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-3xl p-6 shadow-sm" dir={isAr ? "rtl" : "ltr"}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About this Package</h2>
                  <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}

              {/* Itinerary */}
              {pkg.itineraries?.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Itinerary</h2>
                  <div className="space-y-3">
                    {pkg.itineraries.map((day: any, i: number) => (
                      <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-[#0F6A4A]/10 text-[#0F6A4A] text-xs font-bold rounded-full flex items-center justify-center">
                              {day.day_number}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{day.title}</p>
                              {day.location && <p className="text-xs text-gray-400">{day.location}</p>}
                            </div>
                          </div>
                          {expandedDay === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {expandedDay === i && day.description && (
                          <div className="px-4 pb-4 pt-1 text-sm text-gray-600 border-t border-gray-50 leading-relaxed">
                            {day.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions / Exclusions */}
              {(inclusions.length > 0 || exclusions.length > 0) && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">What is Included</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inclusions.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2"><Check className="w-4 h-4" /> Included</p>
                        <ul className="space-y-2">
                          {inclusions.map((inc: any, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{inc.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exclusions.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2"><X className="w-4 h-4" /> Excluded</p>
                        <ul className="space-y-2">
                          {exclusions.map((exc: any, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />{exc.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-[#0F6A4A] mb-1">{formatCurrency(pkg.base_price, pkg.currency)}</p>
                <p className="text-xs text-gray-400 mb-6">per person (economy tier)</p>
                <button onClick={() => router.push(`/booking?package=${pkg.id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-[#0F6A4A] hover:bg-[#0A4F38] text-white font-semibold py-4 rounded-2xl transition-colors mb-3">
                  Book This Package <ArrowRight className="w-4 h-4" />
                </button>
                <Link href="/contact"
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#0F6A4A] text-[#0F6A4A] hover:bg-[#0F6A4A] hover:text-white font-semibold py-3.5 rounded-2xl transition-all">
                  Enquire Now
                </Link>
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Free cancellation up to 30 days</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Flexible payment plans</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 24/7 support included</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
