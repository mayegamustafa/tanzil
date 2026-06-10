import PackageDetailClient from "@/components/packages/PackageDetailClient";
export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PackageDetailClient slug={slug} />;
}
