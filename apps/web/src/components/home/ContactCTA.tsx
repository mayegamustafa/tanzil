"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/cms";

export default function ContactCTA({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-20 lg:py-28 bg-[#F8F5EE]">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0F6A4A] via-[#0d5e42] to-[#0A4F38] rounded-[2rem]">

          {/* Background decoration */}
          <div className="absolute inset-0 pattern-islamic opacity-60" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96B]/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/3 blur-2xl" />

          <div className="relative p-10 lg:p-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">

              {/* Text + CTAs */}
              <div className="lg:max-w-lg">
                <span className="section-label text-[#C8A96B] mb-5 block">Get Started Today</span>
                <h2
                  className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                  Ready to Begin Your Sacred Journey?
                </h2>
                <p className="text-white/65 text-base leading-relaxed mb-8">
                  Speak with our travel specialists today. We are here to help you plan the Hajj or
                  Umrah of your dreams, with care, expertise and real dedication.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/booking"
                    className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#C8A96B] hover:bg-[#A8893B] text-white font-semibold rounded-2xl transition-all hover:shadow-xl hover:shadow-[#C8A96B]/30 hover:-translate-y-0.5">
                    {settings.cta_primary}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white/10 hover:bg-white/18 border border-white/25 text-white font-semibold rounded-2xl transition-all">
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Contact cards */}
              <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[280px]">
                <a
                  href={`tel:${settings.contact_phone_1}`}
                  className="flex items-center gap-4 bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/25 rounded-2xl px-5 py-4 transition-all">
                  <div className="w-10 h-10 bg-[#C8A96B]/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#C8A96B]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">Uganda Office</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{settings.contact_phone_1}</p>
                  </div>
                </a>

                <a
                  href={`tel:${settings.contact_phone_3}`}
                  className="flex items-center gap-4 bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/25 rounded-2xl px-5 py-4 transition-all">
                  <div className="w-10 h-10 bg-[#C8A96B]/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#C8A96B]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">Saudi Arabia</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{settings.contact_phone_3}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-4 bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/25 rounded-2xl px-5 py-4 transition-all">
                  <div className="w-10 h-10 bg-[#C8A96B]/20 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C8A96B]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">Email</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{settings.contact_email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">Address</p>
                    <p className="text-white/75 text-xs mt-0.5 leading-relaxed">{settings.contact_address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
