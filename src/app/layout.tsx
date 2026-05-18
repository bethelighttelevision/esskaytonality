import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESSKAYTONALITY | Music Entertainment",
  description: "Global music entertainment platform and digital record label. Discover the next generation of sound.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-text">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
