import { createServerClient } from "@supabase/ssr";

const seedVideos = [
  { title: "Qaid Qalandar | Sahir Alam | Oma Aslam | Dixon Wilson", category: "EssKay Tonality", youtube_id: "b-yMQjOqpHQ", duration: "4:32", is_featured: true, display_order: 1 },
  { title: "Saiyaara (Extended Cover) Lyrical | Nasir Abbas | Sahir Alam | Faheem Abdullah", category: "EssKay Tonality", youtube_id: "gCsv3X5ofhI", duration: "5:34", display_order: 2 },
  { title: "Tere Bina | Numan Khan | Sahir Alam | Sumble Noreen | Saher Khan", category: "EssKay Tonality", youtube_id: "QNmwgrqbYGA", duration: "4:12", display_order: 3 },
  { title: "Vigad Gayi Ae | Reprise Version | Arsalan Arshad | Sahir Alam", category: "EssKay Tonality", youtube_id: "qxPGQLGpCmA", duration: "3:58", display_order: 4 },
  { title: "Pehchaan | Tribute to Sushant Singh Rajput", category: "EssKay Tonality", youtube_id: "Vy7wwoI_Ofo", duration: "4:45", display_order: 5 },
  { title: "Poem | Mujhe Main Banna Hai | Life of Millions | Sahir Alam", category: "EssKay Tonality", youtube_id: "Md0x5Yp5QhM", duration: "2:58", display_order: 6 },
  { title: "Apni Duniya Official Video | Sahir A, Aparajita L, Karthik J", category: "EssKay Tonality", youtube_id: "IyUsygCb8sU", duration: "4:20", display_order: 7 },
  { title: "Amn (Peace) Song | Tonality | 2018", category: "Live Sessions", youtube_id: "jb3UqLcIDEQ", duration: "3:15", display_order: 8 },
];

const seedFaq = [
  { category: "General", question: "What is Esskaytonality?", answer: "Esskaytonality is an independent record label and music entertainment platform founded by Sahir Alam.", display_order: 1 },
  { category: "General", question: "Who owns Esskaytonality?", answer: "Esskaytonality is owned and operated by founder Sahir Alam.", display_order: 2 },
  { category: "General", question: "Where is Esskaytonality based?", answer: "Our headquarters is located in Rotterdam, Netherlands.", display_order: 3 },
  { category: "General", question: "How can I contact Esskaytonality?", answer: "Visit our Contact page or email us through the form on the site.", display_order: 4 },
  { category: "For Artists", question: "How do I submit my demo?", answer: "Submit through our contact form with links to your music and a brief bio.", display_order: 5 },
  { category: "For Artists", question: "Does Esskaytonality offer contracts to new artists?", answer: "We evaluate each submission on its artistic merit. We never ask for payment.", display_order: 6 },
  { category: "For Artists", question: "Can I collaborate with Esskaytonality artists?", answer: "Collaboration opportunities are evaluated case-by-case.", display_order: 7 },
  { category: "For Artists", question: "How are royalties handled?", answer: "Royalty distribution follows standard industry practices.", display_order: 8 },
  { category: "Audience & Fans", question: "How can I listen to Esskaytonality music?", answer: "Available on Spotify, Apple Music, YouTube, and Deezer.", display_order: 9 },
  { category: "Audience & Fans", question: "Can I use Esskaytonality music in my content?", answer: "Contact us through the Contact page for licensing inquiries.", display_order: 10 },
  { category: "Audience & Fans", question: "How can I stay updated?", answer: "Follow us on social media and check our News page.", display_order: 11 },
  { category: "Audience & Fans", question: "Is there a fan club?", answer: "Sign up on our website to receive updates.", display_order: 12 },
  { category: "Technical", question: "Why can't I play a song?", answer: "Try refreshing or clearing your cache. Contact us if issues persist.", display_order: 13 },
  { category: "Technical", question: "How do I create an account?", answer: 'Click "Sign Up" to register with email or Google OAuth.', display_order: 14 },
  { category: "Technical", question: "I forgot my password", answer: "Go to Login and click 'Forgot Password' to reset.", display_order: 15 },
];

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";

    // Create a supabase client using request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookie.split(";").map(c => { const [n, ...v] = c.trim().split("="); return { name: n, value: v.join("=") }; }),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const results: Record<string, any> = {};

    const seed = async (table: string, data: any[], label: string) => {
      try {
        const { error: delErr } = await supabase.from(table).delete().not("id", "is", null);
        if (delErr) { results[table] = `Delete error: ${delErr.message}`; return; }
        const { error } = await supabase.from(table).insert(data);
        results[table] = error ? `Error: ${error.message}` : `Seeded ${data.length} ${label}`;
      } catch (e: any) { results[table] = `Error: ${e.message}`; }
    };

    const seedHomepageSections = [
      { section_key: "hero", label: "Hero Carousel", display_order: 1, is_visible: true },
      { section_key: "features", label: "Featured Content", display_order: 2, is_visible: true },
      { section_key: "videos", label: "Video Showcase", display_order: 3, is_visible: true },
      { section_key: "artists", label: "Artist Roster", display_order: 5, is_visible: true },
      { section_key: "labels", label: "Labels & Divisions", display_order: 6, is_visible: true },
      { section_key: "about", label: "About Section", display_order: 7, is_visible: true },
      { section_key: "contact", label: "Contact & CTA", display_order: 8, is_visible: true },
    ];

    await seed("videos", seedVideos, "videos");
    await seed("faq_items", seedFaq, "FAQ items");
    await seed("homepage_sections", seedHomepageSections, "homepage sections");

    return Response.json(results);
  } catch (err: any) {
    return Response.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
