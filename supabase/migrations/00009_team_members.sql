-- Team members table with categories
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Management',
  title TEXT,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active team members" ON team_members;
CREATE POLICY "Anyone can read active team members" ON team_members
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
