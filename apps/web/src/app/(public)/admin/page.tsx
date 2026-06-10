"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

export default function AdminRedirect() {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin-tanzil-production.up.railway.app";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center">
        <div className="mb-6">
          <img src="/logo.png" alt="Tanzeel" className="h-16 w-auto mx-auto mb-4 brightness-0 invert" />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-[#C8A96B]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            The admin dashboard is hosted on a separate secure server.
          </p>
          <a
            href={`${adminUrl}/login`}
            className="inline-flex items-center gap-2 w-full justify-center bg-[#C8A96B] hover:bg-[#A8893B] text-white font-semibold py-3.5 rounded-2xl transition-all mb-4">
            Go to Admin Login <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-white/50 text-xs">
            <strong>Email:</strong> admin@tanzeeltravels.com
            <br />
            <strong>Password:</strong> admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
