import { fetchSiteSettings } from "@/lib/cms";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const settings = await fetchSiteSettings();
  return (
    <>
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>Privacy Policy</h1>
        <p className="text-white/70 mt-3">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      <div className="py-16 bg-white">
        <div className="container-site max-w-3xl prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, phone number, passport details, and payment information when you make a booking or inquiry through {settings.site_name}.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use your personal information to process bookings, communicate with you about your travel, provide customer support, and comply with legal obligations including Saudi Arabian visa requirements.</p>
          <h2>3. Information Sharing</h2>
          <p>We share your information with Saudi Arabian authorities for Hajj and Umrah visa processing, airlines, hotels, and ground transport providers as necessary to fulfill your booking. We do not sell your personal information to third parties.</p>
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse.</p>
          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or request deletion of your personal data. Contact us at {settings.contact_email} to exercise these rights.</p>
          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at {settings.contact_email} or call {settings.contact_phone_1}.</p>
        </div>
      </div>
    </>
  );
}
