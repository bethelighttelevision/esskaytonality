import type { Metadata } from "next";
import { ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | ESSKAYTONALITY",
  description: "ESSKAYTONALITY terms of service — rules and guidelines for using our music platform.",
};

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using ESSKAYTONALITY, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.",
    },
    {
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information when creating an account.",
    },
    {
      title: "Content Submission",
      content: "Artists retain ownership of their submitted content. By submitting content, you grant ESSKAYTONALITY a non-exclusive license to display, distribute, and promote your content on our platform and associated channels.",
    },
    {
      title: "Prohibited Conduct",
      content: "You agree not to: upload infringing or unlawful content, attempt to access unauthorized areas, disrupt platform operations, impersonate others, or collect user data without consent.",
    },
    {
      title: "Intellectual Property",
      content: "All platform content, trademarks, and branding are owned by ESSKAYTONALITY unless otherwise stated. User-submitted content remains the property of its creator.",
    },
    {
      title: "Limitation of Liability",
      content: "ESSKAYTONALITY is not liable for indirect or consequential damages arising from platform use. Our total liability is limited to the amount paid by you in the preceding 12 months.",
    },
    {
      title: "Termination",
      content: "We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time by contacting us.",
    },
    {
      title: "Changes to Terms",
      content: "We may modify these terms. Continued use after changes constitutes acceptance. We will notify users of material changes via email or platform notice.",
    },
    {
      title: "Contact",
      content: "For questions about these terms, contact us at ",
      email: "contact@esskaytonality.com",
    },
  ];

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center">
            <ScrollText className="w-6 h-6 text-brand-accent" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              Terms of <span className="text-gradient">Service</span>
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
