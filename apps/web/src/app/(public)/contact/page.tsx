import { fetchSiteSettings } from "@/lib/cms";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await fetchSiteSettings();
  return <ContactPageClient settings={settings} />;
}
