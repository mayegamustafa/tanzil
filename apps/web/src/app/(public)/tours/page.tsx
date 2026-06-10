import { fetchSiteSettings } from "@/lib/cms";
import PackageListPage from "@/components/packages/PackageListPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tour Packages" };

export default async function ToursPage() {
  const settings = await fetchSiteSettings();
  return <PackageListPage type="local,international" title="Tour Packages" subtitle="Discover extraordinary destinations — from the heart of Africa to iconic cities around the world" settings={settings} />;
}
