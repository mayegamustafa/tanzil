import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";
import { fetchSiteSettings } from "@/lib/cms";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], variable: "--font-cormorant", display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
const playfair = Playfair_Display({
  subsets: ["latin"], variable: "--font-playfair", display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  return {
    title: { template: `%s | ${settings.site_name}`, default: settings.site_name },
    description: settings.seo_description,
    icons: { icon: "/logo.png" },
    openGraph: {
      siteName: settings.site_name,
      images: settings.seo_og_image ? [settings.seo_og_image] : [],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

