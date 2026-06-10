import PackageDetailClient from "@/components/packages/PackageDetailClient";
export default async function UmrahDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PackageDetailClient slug={slug} />;
}
