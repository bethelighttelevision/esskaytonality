import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ClientAnimations from "@/components/ui/ClientAnimations";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ESSKAYTONALITY",
    default: "ESSKAYTONALITY | Music Entertainment",
  },
  description: "Global music entertainment platform and digital record label. Discover the next generation of sound with Sahir Alam and exclusive artist catalog.",
  keywords: ["music", "record label", "Sahir Alam", "Esskaytonality", "indie music", "music entertainment"],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://esskaytonality.com"),
  openGraph: {
    title: "ESSKAYTONALITY | Music Entertainment",
    description: "Global music entertainment platform and digital record label.",
    url: "https://esskaytonality.com",
    siteName: "ESSKAYTONALITY",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESSKAYTONALITY | Music Entertainment",
    description: "Global music entertainment platform and digital record label.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "ESSKAYTONALITY",
    description: "Global music entertainment platform and digital record label.",
    url: "https://esskaytonality.com",
    founder: {
      "@type": "Person",
      name: "Sahir Alam",
    },
    sameAs: [
      "https://www.youtube.com/@esskaytonality",
      "https://www.instagram.com/esskaytonalityofficial",
      "https://facebook.com/esskaytonality",
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ESSKAYTONALITY" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="google-site-verification" content="y9PBPRZFOqq0Smd4KlWHx9LFFI02xCu3TxfCTPvgx44" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://esskaytonality.com" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-startup-image" href="/icon-512.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://rddqvkusjsfvguaplkba.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TMS9KB6WMZ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TMS9KB6WMZ');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-text">
        <style>{`div[hidden]#S\\:0{display:block!important}`}</style>
        <ClientAnimations />
        <div className="relative z-10 flex flex-col min-h-full">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
