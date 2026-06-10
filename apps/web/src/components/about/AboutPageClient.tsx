"use client";
import { motion } from "framer-motion";
import { Shield, Award, Users, Heart } from "lucide-react";
import type { SiteSettings } from "@/lib/cms";
import Link from "next/link";

export default function AboutPageClient({ settings }: { settings: SiteSettings }) {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-24 relative overflow-hidden">
        <div className="container-site text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            About Tanzeel Travels
          </motion.h1>
          <p className="text-white/75 max-w-2xl mx-auto text-base">
            {settings.footer_about}
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#C8A96B] text-sm font-semibold uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                Serving Pilgrims Since Our Founding
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Tanzeel Travels was founded with a single mission: to make the sacred journey of Hajj and Umrah accessible, comfortable, and spiritually meaningful for every Muslim in Uganda and East Africa.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Based in Kampala, Uganda with a presence in the Kingdom of Saudi Arabia, we have helped thousands of pilgrims fulfil their obligation and experience the divine hospitality of the holy cities.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: settings.stat_pilgrims + "+", label: "Happy Pilgrims" },
                  { value: settings.stat_years + "+", label: "Years of Service" },
                  { value: settings.stat_destinations + "+", label: "Destinations" },
                  { value: settings.stat_rating + "★", label: "Average Rating" },
                ].map(({ value, label }) => (
                  <div key={label} className="p-5 bg-[#F8F5EE] rounded-2xl text-center">
                    <p className="text-2xl font-bold text-[#0F6A4A]">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0F6A4A] to-[#0A4F38] rounded-3xl h-80 lg:h-96 flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 32 32" fill="none" opacity="0.3">
                  <path d="M16 3L4 10v12l12 7 12-7V10L16 3z" stroke="white" strokeWidth="1" />
                  <circle cx="16" cy="16" r="6" fill="white" opacity="0.5" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#C8A96B] rounded-3xl p-6 shadow-xl">
                <p className="text-white font-bold text-2xl">{settings.stat_years}+</p>
                <p className="text-white/80 text-sm">Years serving pilgrims</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-[#F8F5EE]">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Trust", body: "We operate with complete transparency and honesty in all dealings." },
              { icon: Award, title: "Excellence", body: "We pursue the highest standards in every package and service we offer." },
              { icon: Users, title: "Community", body: "We are deeply rooted in the Muslim community of East Africa." },
              { icon: Heart, title: "Care", body: "We treat every pilgrim as we would treat our own family members." },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-[#0F6A4A]/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-[#0F6A4A]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-white text-center">
        <div className="container-site max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>Ready to Plan Your Journey?</h2>
          <p className="text-gray-500 mb-8">Browse our packages or get in touch with our team today.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/hajj" className="bg-[#0F6A4A] hover:bg-[#0A4F38] text-white font-semibold px-7 py-3.5 rounded-2xl transition-colors">View Packages</Link>
            <Link href="/contact" className="border-2 border-[#0F6A4A] text-[#0F6A4A] hover:bg-[#0F6A4A] hover:text-white font-semibold px-7 py-3.5 rounded-2xl transition-all">Contact Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}
