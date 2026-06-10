import { fetchSiteSettings } from "@/lib/cms";
import PackageListPage from "@/components/packages/PackageListPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Umrah Packages" };

export default async function UmrahPage() {
  const settings = await fetchSiteSettings();
  return <PackageListPage type="umrah" title="Umrah Packages" subtitle="Perform Umrah at any time of the year — our packages make the journey seamless and spiritually fulfilling" settings={settings} />;
}
