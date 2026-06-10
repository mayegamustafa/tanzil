import { fetchSiteSettings } from "@/lib/cms";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { headers } from "next/headers";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";

  return (
    <LanguageProvider>
      <Header settings={settings} currentPath={pathname} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings.whatsapp_number} />
    </LanguageProvider>
  );
}
