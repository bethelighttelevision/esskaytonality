import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | ESSKAYTONALITY",
  description: "ESSKAYTONALITY privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide when registering, uploading content, or contacting us. This includes your name, email address, and any content you submit. We also automatically collect certain technical data such as IP address, browser type, and usage patterns.",
    },
    {
      title: "How We Use Your Information",
      content: "Your information is used to operate our platform, process your requests, send notifications about releases and platform updates, improve our services, and comply with legal obligations.",
    },
    {
      title: "Data Sharing",
      content: "We do not sell your personal information. We may share data with trusted service providers (Supabase for database hosting, Resend for email delivery) who are bound by confidentiality agreements. We may disclose information if required by law.",
    },
    {
      title: "Cookies",
      content: "Our platform uses essential cookies for authentication and session management. We do not use third-party tracking cookies. You can control cookie settings through your browser preferences.",
    },
    {
      title: "Data Retention",
      content: "We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data by contacting us.",
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing. To exercise these rights, contact us at contact@esskaytonality.com.",
    },
    {
      title: "Security",
      content: "We implement appropriate technical and organizational measures to protect your data, including encryption in transit and at rest, access controls, and regular security reviews.",
    },
    {
      title: "Changes to This Policy",
      content: "We may update this privacy policy from time to time. Changes will be posted on this page with an updated effective date.",
    },
    {
      title: "Contact",
      content: "For privacy-related inquiries, email us at ",
      email: "contact@esskaytonality.com",
    },
  ];

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-brand-muted-dark text-sm mt-1">Last updated: May 2026</p>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section: any, idx: number) => (
            <div key={idx} className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
              {"email" in section ? (
                <p className="text-brand-muted text-sm leading-relaxed">
                  {section.content}
                  <a href={`mailto:${section.email}`} className="text-brand-primary hover:text-white transition-colors">{section.email}</a>.
                </p>
              ) : (
                <p className="text-brand-muted text-sm leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
