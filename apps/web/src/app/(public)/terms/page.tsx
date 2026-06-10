import { fetchSiteSettings } from "@/lib/cms";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const settings = await fetchSiteSettings();
  return (
    <>
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>Terms &amp; Conditions</h1>
        <p className="text-white/70 mt-3">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      <div className="py-16 bg-white">
        <div className="container-site max-w-3xl prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By using {settings.site_name} services and making a booking, you agree to be bound by these Terms and Conditions.</p>
          <h2>2. Booking and Payment</h2>
          <p>All bookings require a deposit to secure your place. Full payment must be received at least 30 days before departure. We accept bank transfer, mobile money, and card payments.</p>
          <h2>3. Cancellation Policy</h2>
          <p>Cancellations made more than 60 days before departure receive a full refund minus the deposit. Cancellations 30-60 days before receive 50% refund. Cancellations within 30 days are non-refundable due to commitments made with hotels and airlines.</p>
          <h2>4. Hajj and Umrah Visa Requirements</h2>
          <p>Clients are responsible for providing accurate passport and personal information. {settings.site_name} will not be held liable for visa rejections due to incorrect information provided by clients.</p>
          <h2>5. Travel Insurance</h2>
          <p>We strongly recommend all travellers obtain comprehensive travel insurance. {settings.site_name} is not liable for losses arising from illness, injury, or circumstances beyond our control.</p>
          <h2>6. Changes to Itinerary</h2>
          <p>We reserve the right to make necessary changes to itineraries due to circumstances beyond our control including airline schedule changes, hotel availability, or religious authority decisions.</p>
          <h2>7. Contact</h2>
          <p>For questions about these terms, contact {settings.contact_email} or {settings.contact_phone_1}. Office: {settings.contact_address}.</p>
        </div>
      </div>
    </>
  );
}
