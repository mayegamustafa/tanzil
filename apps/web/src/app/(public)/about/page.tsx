import { fetchSiteSettings } from "@/lib/cms";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await fetchSiteSettings();
  return <AboutPageClient settings={settings} />;
}
