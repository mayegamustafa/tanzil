/**
 * CMS utilities — fetch site settings with ISR caching.
 * These run on the server via Next.js fetch (not axios).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_logo: string;
  site_favicon: string;
  contact_phone_1: string;
  contact_phone_2: string;
  contact_phone_3: string;
  contact_email: string;
  contact_address: string;
  contact_office_hours: string;
  contact_maps_embed: string;
  whatsapp_number: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  color_primary: string;
  color_deep: string;
  color_accent: string;
  color_cream: string;
  hero_image: string;
  hero_heading: string;
  hero_subheading: string;
  cta_primary: string;
  cta_secondary: string;
  footer_text: string;
  footer_about: string;
  seo_description: string;
  seo_og_image: string;
  google_analytics_id: string;
  stat_pilgrims: string;
  stat_years: string;
  stat_destinations: string;
  stat_rating: string;
  [key: string]: string;
}

// Default fallbacks so UI never breaks even if API is down
export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Tanzeel Travels",
  site_tagline: "Your Journey to the Sacred",
  site_logo: "",
  site_favicon: "",
  contact_phone_1: "+256785925106",
  contact_phone_2: "+256700958422",
  contact_phone_3: "+966592250741",
  contact_email: "info@tanzeel-travels.com",
  contact_address: "Masitowa Ndejje, off Entebbe Road, Eddie Petroleum Building",
  contact_office_hours: "Mon–Sat: 8am–6pm | Sun: 9am–2pm",
  contact_maps_embed: "",
  whatsapp_number: "+256785925106",
  social_facebook: "",
  social_instagram: "",
  social_twitter: "",
  social_youtube: "",
  color_primary: "#0F6A4A",
  color_deep: "#0A4F38",
  color_accent: "#C8A96B",
  color_cream: "#F8F5EE",
  hero_image: "",
  hero_heading: "Sacred Journeys, Extraordinary Experiences",
  hero_subheading: "Premium Hajj & Umrah packages crafted for the modern pilgrim",
  cta_primary: "Book Your Journey",
  cta_secondary: "Explore Packages",
  footer_text: "© 2024 Tanzeel Travels. All rights reserved.",
  footer_about: "A trusted name in Hajj, Umrah and guided tours.",
  seo_description: "Tanzeel Travels — Premium Hajj and Umrah packages from Uganda.",
  seo_og_image: "",
  google_analytics_id: "",
  stat_pilgrims: "5,000+",
  stat_years: "15+",
  stat_destinations: "20+",
  stat_rating: "4.9/5",
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_URL}/settings/public`, {
      next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
    });
    if (!res.ok) return DEFAULT_SETTINGS;
    const json = await res.json();
    // API returns array of {key, value} or object
    const raw: any = json.data ?? json;
    if (Array.isArray(raw)) {
      const mapped: Record<string, string> = {};
      raw.forEach((s: any) => { mapped[s.key] = s.value ?? ""; });
      return { ...DEFAULT_SETTINGS, ...mapped };
    }
    return { ...DEFAULT_SETTINGS, ...raw };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
