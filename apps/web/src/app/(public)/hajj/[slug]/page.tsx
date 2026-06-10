import PackageDetailClient from "@/components/packages/PackageDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PackageDetailClient slug={slug} />;
}
