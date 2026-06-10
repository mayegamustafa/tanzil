"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { postPublic } from "@/lib/api";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/cms";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject required"),
  message: z.string().min(10, "Message required"),
});
type FormData = z.infer<typeof schema>;

export default function ContactPageClient({ settings }: { settings: SiteSettings }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormData) => postPublic("/inquiries", data),
    onSuccess: () => reset(),
  });

  const contacts = [
    { icon: Phone, label: "Uganda Office", value: settings.contact_phone_1, href: `tel:${settings.contact_phone_1}` },
    { icon: Phone, label: "KSA Office", value: settings.contact_phone_3, href: `tel:${settings.contact_phone_3}` },
    { icon: Mail, label: "Email", value: settings.contact_email, href: `mailto:${settings.contact_email}` },
    { icon: MapPin, label: "Address", value: settings.contact_address, href: "#" },
    { icon: Clock, label: "Office Hours", value: settings.contact_hours, href: "#" },
  ];

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
          Get in Touch
        </motion.h1>
        <p className="text-white/70 max-w-xl mx-auto">We are here to answer any questions about our packages and help you plan your journey</p>
      </div>

      <div className="py-16 bg-[#F8F5EE]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-4">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-[#0F6A4A]/8 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#0F6A4A]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
              {isSuccess ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Full Name *</label>
                      <input {...register("name")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Email *</label>
                      <input type="email" {...register("email")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Phone</label>
                      <input {...register("phone")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Subject *</label>
                      <input {...register("subject")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Message *</label>
                    <textarea rows={5} {...register("message")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A] resize-none" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isPending}
                    className="w-full bg-[#0F6A4A] hover:bg-[#0A4F38] text-white font-semibold py-4 rounded-2xl transition-colors disabled:opacity-60">
                    {isPending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
