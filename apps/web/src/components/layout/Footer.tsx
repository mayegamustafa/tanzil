import Link from "next/link";
import type { SiteSettings } from "@/lib/cms";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface FooterProps {
  settings: SiteSettings;
}

const QUICK_LINKS = [
  { label: "Hajj Packages",   href: "/hajj" },
  { label: "Umrah Packages",  href: "/umrah" },
  { label: "Tour Packages",   href: "/tours" },
  { label: "Book Now",        href: "/booking" },
  { label: "Check Booking",   href: "/booking-status" },
];

const INFO_LINKS = [
  { label: "About Us",        href: "/about" },
  { label: "Blog",            href: "/blog" },
  { label: "Gallery",         href: "/gallery" },
  { label: "FAQs",            href: "/faq" },
  { label: "Contact",         href: "/contact" },
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms of Service",href: "/terms" },
];

export default function Footer({ settings }: FooterProps) {
  const phones = [settings.contact_phone_1, settings.contact_phone_2, settings.contact_phone_3].filter(Boolean);

  return (
    <footer className="bg-[#0A4F38] text-white">
      {/* Main footer */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                <img src="/logo.png" alt={settings.site_name} className="h-10 w-auto object-contain" />
              </div>
              <div>
                <p className="font-bold text-lg font-heading leading-none">{settings.site_name}</p>
                <p className="text-white/50 text-xs mt-0.5">{settings.site_tagline}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">{settings.footer_about}</p>
            {/* Social */}
            <div className="flex gap-3">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C8A96B]/30 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C8A96B]/30 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C8A96B]/30 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C8A96B]/30 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0A4F38"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">Packages</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#C8A96B] text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">Information</h3>
            <ul className="space-y-3">
              {INFO_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#C8A96B] text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4">
              {phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone}`} className="flex items-start gap-3 text-white/60 hover:text-[#C8A96B] text-sm transition-colors">
                    <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${settings.contact_email}`} className="flex items-start gap-3 text-white/60 hover:text-[#C8A96B] text-sm transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {settings.contact_email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{settings.contact_address}</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{settings.contact_office_hours}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">{settings.footer_text}</p>
          <p className="text-white/30 text-xs">Designed with care for every pilgrim</p>
        </div>
      </div>
    </footer>
  );
}
