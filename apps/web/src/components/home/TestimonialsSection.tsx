"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "fill-[#C8A96B] text-[#C8A96B]" : "text-white/15"
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { data } = useQuery({
    queryKey: ["testimonials-public"],
    queryFn: () => api.get("/testimonials").then((r) => r.data.data),
  });

  const testimonials = data ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-28 bg-[#0A4F38] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-islamic opacity-60" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96B]/8 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/4 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="relative container-site">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="section-label text-[#C8A96B] mb-4 justify-center" style={{ display: "inline-flex" }}>
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            Words from Our Pilgrims
          </motion.h2>
          <div className="divider-gold mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              className="group relative bg-white/6 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-3xl p-7 transition-all duration-300">

              {/* Decorative quote mark */}
              <div
                className="absolute top-5 right-6 text-5xl text-[#C8A96B]/15 leading-none select-none pointer-events-none"
                style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;
              </div>

              <Stars rating={t.rating ?? 5} />

              <p className="text-white/75 text-sm leading-relaxed mt-4 mb-6 italic">
                {t.content}
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8A96B]/40 to-[#C8A96B]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#C8A96B] font-bold text-sm">{t.name?.[0] ?? "P"}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">{t.name}</p>
                  {t.location && (
                    <p className="text-white/45 text-xs mt-1">{t.location}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
