"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/cms";
import { useLang } from "@/contexts/LanguageContext";

const PACKAGES_DROPDOWN = [
  { label: "Hajj Packages",       href: "/hajj",                       desc: "Annual pilgrimage packages" },
  { label: "Umrah Packages",      href: "/umrah",                      desc: "Year-round sacred visits" },
  { label: "Local Tours",         href: "/tours",                      desc: "Explore East Africa" },
  { label: "International Tours", href: "/tours?type=international",   desc: "Worldwide destinations" },
];

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Packages",  href: "/hajj", dropdown: PACKAGES_DROPDOWN },
  { label: "Blog",      href: "/blog" },
  { label: "Gallery",   href: "/gallery" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
];

interface HeaderProps {
  settings: SiteSettings;
  currentPath?: string;
}

export default function Header({ settings, currentPath = "/" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pkgOpen, setPkgOpen] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const onTop = !scrolled;
  const textCol = onTop ? "text-white/85" : "text-gray-700";
  const textHover = onTop ? "hover:text-white hover:bg-white/10" : "hover:text-[#0F6A4A] hover:bg-[#0F6A4A]/6";
  const activeText = onTop ? "text-white bg-white/15" : "text-[#0F6A4A] bg-[#0F6A4A]/6";

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-white/97 backdrop-blur-xl shadow-sm border-b border-gray-100/80"
        : "bg-transparent"
    )}>
      {/* ── Collapsible top info bar ─────────────────────────────────────── */}
      <motion.div
        animate={{ height: scrolled ? 0 : 36, opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden bg-[#0A4F38]">
        <div className="container-site flex items-center justify-between h-9">
          <p className="text-[11px] text-white/60">
            {settings.contact_office_hours ?? "Mon – Sat  8 am – 6 pm"}
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${settings.contact_phone_1}`}
              className="flex items-center gap-1.5 text-[11px] text-white/70 hover:text-[#C8A96B] transition-colors">
              <Phone className="w-3 h-3" />
              {settings.contact_phone_1}
            </a>
            <a href={`mailto:${settings.contact_email}`}
              className="hidden sm:block text-[11px] text-white/70 hover:text-[#C8A96B] transition-colors">
              {settings.contact_email}
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Main navigation bar ──────────────────────────────────────────── */}
      <div className="container-site">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img
              src="/logo.png"
              alt={settings.site_name}
              className="h-11 w-auto transition-all"
              style={!scrolled ? { filter: "brightness(0) invert(1)" } : undefined}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href, dropdown }) =>
              dropdown ? (
                <div key={href} className="relative"
                  onMouseEnter={() => setPkgOpen(true)}
                  onMouseLeave={() => setPkgOpen(false)}>
                  <button className={cn(
                    "flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors",
                    textCol, textHover
                  )}>
                    {label}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", pkgOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {pkgOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-2">
                          {dropdown.map((item) => (
                            <Link key={item.href} href={item.href}
                              className="flex flex-col px-4 py-3 rounded-xl hover:bg-[#F8F5EE] group/dd transition-colors">
                              <span className="text-sm font-semibold text-gray-900 group-hover/dd:text-[#0F6A4A] transition-colors">
                                {item.label}
                              </span>
                              <span className="text-xs text-gray-400 mt-0.5">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={href} href={href}
                  className={cn(
                    "px-3.5 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentPath === href ? activeText : cn(textCol, textHover)
                  )}>
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* Right: secondary + language toggle + CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/booking-status"
              className={cn(
                "hidden sm:inline-flex text-xs font-medium px-3 py-1.5 rounded-lg border transition-all",
                scrolled
                  ? "border-gray-200 text-gray-600 hover:border-[#0F6A4A]/40 hover:text-[#0F6A4A]"
                  : "border-white/20 text-white/75 hover:border-white/40 hover:text-white"
              )}>
              Track Booking
            </Link>

            {/* Language toggle EN | AR */}
            <div className={cn(
              "hidden sm:flex items-center rounded-lg border overflow-hidden text-xs font-semibold transition-all",
              scrolled ? "border-gray-200" : "border-white/20"
            )}>
              {(["en", "ar"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    lang === l
                      ? scrolled ? "bg-[#0F6A4A] text-white" : "bg-white/20 text-white"
                      : scrolled ? "text-gray-500 hover:text-[#0F6A4A]" : "text-white/60 hover:text-white"
                  )}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/booking"
              className={cn(
                "hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all",
                scrolled
                  ? "bg-[#0F6A4A] hover:bg-[#0A4F38] text-white shadow-sm hover:shadow-md"
                  : "bg-[#C8A96B] hover:bg-[#A8893B] text-white"
              )}>
              {settings.cta_primary}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
                scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              )}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="container-site py-5 space-y-1">
              {NAV_LINKS.map(({ label, href, dropdown }) => (
                <div key={href}>
                  <Link href={href} onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-[#0F6A4A] transition-colors">
                    {label}
                  </Link>
                  {dropdown?.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 pl-8 pr-4 py-2 text-sm text-gray-500 hover:text-[#0F6A4A] rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B] shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="pt-3 flex flex-col gap-2.5 border-t border-gray-100 mt-2">
                <Link href="/booking-status" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-[#0F6A4A]/40 hover:text-[#0F6A4A] transition-colors">
                  Track Booking
                </Link>
                {/* Language toggle for mobile */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold">
                  {(["en", "ar"] as const).map((l) => (
                    <button key={l} onClick={() => { setLang(l); setMobileOpen(false); }}
                      className={cn(
                        "flex-1 py-3 transition-colors",
                        lang === l ? "bg-[#0F6A4A] text-white" : "text-gray-500 hover:text-[#0F6A4A]"
                      )}>
                      {l === "en" ? "English" : "عربي"}
                    </button>
                  ))}
                </div>
                <Link href="/booking" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 bg-[#0F6A4A] text-white text-sm font-semibold rounded-xl hover:bg-[#0A4F38] transition-colors">
                  {settings.cta_primary}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

