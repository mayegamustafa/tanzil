"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/cms";
import { ArrowRight, Phone, Award } from "lucide-react";

interface HeroProps {
  settings: SiteSettings;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function HeroSection({ settings }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {settings.hero_image ? (
          <img src={settings.hero_image} alt="Hero" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#072e21] via-[#0A4F38] to-[#0d5e42]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        {/* Islamic geometric tile */}
        <div className="absolute inset-0 pattern-islamic" />
        {/* Radial gold glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#C8A96B]/8 blur-3xl pointer-events-none" />
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="relative container-site pt-36 pb-28 lg:pt-44 lg:pb-36">
        <div className="max-w-3xl">

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.08] mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            {settings.hero_heading}
          </motion.h1>

          {/* Gold accent divider */}
          <motion.div {...fadeUp(0.15)} className="divider-gold mb-6" />

          {/* Subheading */}
          <motion.p {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl">
            {settings.hero_subheading}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/booking"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C8A96B] hover:bg-[#A8893B] text-white font-semibold rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#C8A96B]/30 hover:-translate-y-0.5 text-base">
              {settings.cta_primary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/hajj"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/18 text-white font-semibold rounded-2xl transition-all text-base">
              {settings.cta_secondary}
            </Link>
          </motion.div>

          {/* Quick stats strip */}
          <motion.div {...fadeUp(0.38)}
            className="flex flex-wrap gap-6 sm:gap-10 border-t border-white/15 pt-8">
            {[
              { value: settings.stat_pilgrims,     label: "Pilgrims Served" },
              { value: settings.stat_years,        label: "Years of Service" },
              { value: settings.stat_destinations, label: "Destinations" },
              { value: `${settings.stat_rating}★`, label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white leading-none"
                  style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                  {s.value}
                </p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Floating contact panel (xl only) ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-3 mr-4">

          <a href={`tel:${settings.contact_phone_1}`}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 rounded-2xl px-5 py-3.5 transition-all hover:-translate-x-1">
            <div className="w-9 h-9 bg-[#C8A96B]/20 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wide">Uganda</p>
              <p className="text-white font-semibold text-sm">{settings.contact_phone_1}</p>
            </div>
          </a>

          <a href={`tel:${settings.contact_phone_3}`}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 rounded-2xl px-5 py-3.5 transition-all hover:-translate-x-1">
            <div className="w-9 h-9 bg-[#C8A96B]/20 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wide">Saudi Arabia</p>
              <p className="text-white font-semibold text-sm">{settings.contact_phone_3}</p>
            </div>
          </a>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5">
            <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wide">Certified</p>
              <p className="text-white font-semibold text-sm">Licensed Operator</p>
            </div>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
