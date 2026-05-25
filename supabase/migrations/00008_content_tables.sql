-- Content management tables for admin CMS
-- Tables: news_articles, videos, faq_items, executives, homepage_sections

-- 1. News Articles
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Announcements',
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published news" ON news_articles;
CREATE POLICY "Anyone can read published news" ON news_articles
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage news" ON news_articles;
CREATE POLICY "Admins can manage news" ON news_articles
  FOR ALL TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- 2. Videos
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'EssKay Tonality',
  youtube_id TEXT NOT NULL,
  duration TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published videos" ON videos;
CREATE POLICY "Anyone can read published videos" ON videos
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage videos" ON videos;
CREATE POLICY "Admins can manage videos" ON videos
  FOR ALL TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- 3. FAQ Items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'General',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published faq" ON faq_items;
CREATE POLICY "Anyone can read published faq" ON faq_items
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage faq" ON faq_items;
CREATE POLICY "Admins can manage faq" ON faq_items
  FOR ALL TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- 4. Executives (Leadership Team)
CREATE TABLE IF NOT EXISTS executives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE executives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active executives" ON executives;
CREATE POLICY "Anyone can read active executives" ON executives
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage executives" ON executives;
CREATE POLICY "Admins can manage executives" ON executives
  FOR ALL TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- 5. Homepage Sections Configuration
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read homepage sections" ON homepage_sections;
CREATE POLICY "Anyone can read homepage sections" ON homepage_sections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage homepage sections" ON homepage_sections;
CREATE POLICY "Admins can manage homepage sections" ON homepage_sections
  FOR ALL TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- Seed default homepage sections
INSERT INTO homepage_sections (section_key, label, display_order, is_visible) VALUES
  ('hero', 'Hero Carousel', 1, true),
  ('features', 'Featured Content', 2, true),
  ('videos', 'Video Showcase', 3, true),
  ('news', 'News & Updates', 4, true),
  ('artists', 'Artist Roster', 5, true),
  ('labels', 'Labels & Divisions', 6, true),
  ('about', 'About Section', 7, true),
  ('contact', 'Contact & CTA', 8, true)
ON CONFLICT (section_key) DO NOTHING;
