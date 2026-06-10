import { fetchSiteSettings } from "@/lib/cms";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import LatestBlog from "@/components/home/LatestBlog";
import ContactCTA from "@/components/home/ContactCTA";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  return {
    title: settings.seo_title_pattern?.replace("%s |", "").trim() ?? settings.site_name,
    description: settings.seo_description,
  };
}

export default async function HomePage() {
  const settings = await fetchSiteSettings();
  return (
    <>
      <HeroSection settings={settings} />
      <StatsSection settings={settings} />
      <FeaturedPackages />
      <WhyChooseUs />
      <TestimonialsSection />
      <GalleryPreview />
      <LatestBlog />
      <ContactCTA settings={settings} />
    </>
  );
}
