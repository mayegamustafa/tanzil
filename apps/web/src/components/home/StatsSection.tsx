"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { SiteSettings } from "@/lib/cms";

interface StatsSectionProps {
  settings: SiteSettings;
}

// Parses "5,000+" → { num: 5000, suffix: "+" }
function parseValue(raw: string) {
  const cleaned = String(raw).replace(/,/g, "");
  const num = parseFloat(cleaned.replace(/[^0-9.]/g, "")) || 0;
  const suffix = cleaned.replace(/[0-9.]/g, "").trim();
  return { num, suffix };
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const { num, suffix } = parseValue(value);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 55, damping: 18 });
  const display = useTransform(spring, (v) =>
    num % 1 !== 0
      ? v.toFixed(1) + suffix
      : Math.floor(v).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) mv.set(num);
  }, [isInView, mv, num]);

  return <span ref={ref} className="tabular-nums"><motion.span>{display}</motion.span></span>;
}

const STATS = [
  {
    key: "stat_pilgrims",
    label: "Pilgrims Served",
    icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0",
  },
  {
    key: "stat_years",
    label: "Years Experience",
    icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
  {
    key: "stat_destinations",
    label: "Destinations",
    icon: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 0 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
  {
    key: "stat_rating",
    label: "Customer Rating",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z",
  },
];

export default function StatsSection({ settings }: StatsSectionProps) {
  return (
    <section className="relative bg-[#0F6A4A] py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-islamic" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C8A96B]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="relative container-site">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-0 lg:divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="flex flex-col items-center text-center px-6 py-6 group">
              <div className="w-12 h-12 bg-white/8 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/15 transition-colors">
                <svg className="w-5 h-5 text-[#C8A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
              <p
                className="text-3xl lg:text-4xl font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                <AnimatedNumber value={String((settings as Record<string, unknown>)[stat.key] ?? "0")} />
              </p>
              <p className="text-white/55 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
