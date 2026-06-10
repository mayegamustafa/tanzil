"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["faqs-public"],
    queryFn: () => api.get("/faqs").then((r) => r.data.data),
  });

  const filtered = faqs.filter((f: any) =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
          Frequently Asked Questions
        </h1>
        <p className="text-white/70 max-w-xl mx-auto mb-8">Everything you need to know about Hajj, Umrah, and booking with Tanzeel Travels</p>
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm text-gray-700 outline-none shadow-lg" />
        </div>
      </div>

      <div className="py-16 bg-[#F8F5EE]">
        <div className="container-site max-w-3xl">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><p className="text-gray-400 text-lg">No results found.</p></div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq: any, i: number) => (
                <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                    {openId === faq.id ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                  </button>
                  {openId === faq.id && (
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
