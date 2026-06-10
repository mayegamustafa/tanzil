"use client";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
}

export default function WhatsAppButton({
  phone,
  message = "Hello, I am interested in your Hajj & Umrah packages.",
}: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const clean = phone.replace(/[^0-9]/g, "");
  const href = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-900/30 transition-all duration-500 group
        ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}
        hover:shadow-xl hover:shadow-green-900/40`}
    >
      {/* Tooltip */}
      <span className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-4 text-sm font-medium">
        Chat on WhatsApp
      </span>
      <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0">
        <Phone className="w-7 h-7" />
      </div>
    </a>
  );
}
