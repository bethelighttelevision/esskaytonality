import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import FAQClient from "./page-client";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ESSKAYTONALITY — the global record label and music entertainment platform.",
  openGraph: { images: ["/icon-512.png"] },
};

export default async function Page() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("faq_items").select("*").eq("is_published", true).order("display_order", { ascending: true });

  const faqData = items && items.length > 0
    ? Object.entries(items.reduce((acc: Record<string, any[]>, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push({ q: item.question, a: item.answer });
        return acc;
      }, {})).map(([category, items]) => ({ category, items }))
    : null;

  return <FAQClient initialFaq={faqData} />;
}
