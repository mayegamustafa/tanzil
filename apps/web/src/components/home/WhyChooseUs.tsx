"use client";
import { motion } from "framer-motion";

const REASONS = [
  {
    num: "01",
    title: "Trusted & Licensed",
    body: "We are a fully licensed travel agency with over 15 years of experience helping pilgrims from East Africa complete Hajj and Umrah safely.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    num: "02",
    title: "Premium Hotels",
    body: "We book you into 4 and 5-star hotels close to the Haram, with comfortable transport and experienced guides at every stop.",
    icon: "M3 21h18M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16",
  },
  {
    num: "03",
    title: "24/7 Support",
    body: "Our team is available at any hour, before you travel, while you are there, and after you return home. Just give us a call.",
    icon: "M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  {
    num: "04",
    title: "Flexible Payments",
    body: "Pay in installments that suit your budget. We accept mobile money, bank transfer and cash so nothing stands in your way.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z",
  },
  {
    num: "05",
    title: "Full Itinerary Planned",
    body: "Every site, every transfer and every key moment is planned and shared with you before you travel so there are no surprises.",
    icon: "M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-1.447-.894L15 9m0 8V9m0 0L9 7",
  },
  {
    num: "06",
    title: "We Care About You",
    body: "We treat every pilgrim like family, with real care and respect from the first phone call right through to your safe return.",
    icon: "M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container-site">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="section-label text-[#C8A96B] mb-4 justify-center" style={{ display: "inline-flex" }}>
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            Your Journey Deserves the Best
          </motion.h2>
          <div className="divider-gold mx-auto mb-5" />
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="text-gray-500 text-base leading-relaxed">
            We take care of every detail so you can focus entirely on your worship.
          </motion.p>
        </div>

        {/* Numbered grid with gap-px dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              className="group bg-white hover:bg-[#F8F5EE] p-8 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0F6A4A] text-white text-sm font-bold shrink-0"
                  style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                  {reason.num}
                </span>
                <div className="w-10 h-10 bg-[#0F6A4A]/8 group-hover:bg-[#0F6A4A]/14 rounded-2xl flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-[#0F6A4A]"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={reason.icon} />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2.5">{reason.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{reason.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

