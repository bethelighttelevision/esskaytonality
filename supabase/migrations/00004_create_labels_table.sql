-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  color TEXT DEFAULT '#ffffff',
  founded_year INTEGER,
  website_url TEXT,
  genre TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Public can view active labels" ON labels;
DROP POLICY IF EXISTS "Admins can insert labels" ON labels;
DROP POLICY IF EXISTS "Admins can update labels" ON labels;
DROP POLICY IF EXISTS "Admins can delete labels" ON labels;

-- Policy: anyone (even unauthenticated) can view active labels
CREATE POLICY "Public can view active labels" ON labels
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: admins can insert labels
CREATE POLICY "Admins can insert labels" ON labels
  FOR INSERT
  TO authenticated
  WITH CHECK (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- Policy: admins can update labels
CREATE POLICY "Admins can update labels" ON labels
  FOR UPDATE
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- Policy: admins can delete labels
CREATE POLICY "Admins can delete labels" ON labels
  FOR DELETE
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );
