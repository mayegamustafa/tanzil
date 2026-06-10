import { fetchSiteSettings } from "@/lib/cms";
import PackageListPage from "@/components/packages/PackageListPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hajj Packages" };

export default async function HajjPage() {
  const settings = await fetchSiteSettings();
  return <PackageListPage type="hajj" title="Hajj Packages" subtitle="Embark on the most sacred journey of a lifetime — perfectly planned Hajj packages from Uganda" settings={settings} />;
}
