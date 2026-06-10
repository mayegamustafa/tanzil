"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, CalendarCheck, BookOpen, Image, Star,
  HelpCircle, MessageSquare, Users, Mail, Settings, ChevronRight,
} from "lucide-react";

const nav = [
  { label: "Dashboard",     href: "/",              icon: LayoutDashboard },
  { label: "Packages",      href: "/packages",      icon: Package },
  { label: "Bookings",      href: "/bookings",      icon: CalendarCheck },
  { label: "Blog",          href: "/blog",          icon: BookOpen },
  { label: "Gallery",       href: "/gallery",       icon: Image },
  { label: "Testimonials",  href: "/testimonials",  icon: Star },
  { label: "FAQs",          href: "/faqs",          icon: HelpCircle },
  { label: "Inquiries",     href: "/inquiries",     icon: MessageSquare },
  { label: "Users",         href: "/users",         icon: Users },
  { label: "Newsletter",    href: "/newsletter",    icon: Mail },
  { label: "Settings",      href: "/settings",      icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full bg-[#0A4F38] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Tanzeel Travels" className="h-9 w-auto brightness-0 invert" />
        <p className="text-[11px] text-white/50 mt-0.5">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Version */}
      <div className="px-5 py-3 border-t border-white/10 text-[11px] text-white/30">
        v1.0.0
      </div>
    </aside>
  );
}
