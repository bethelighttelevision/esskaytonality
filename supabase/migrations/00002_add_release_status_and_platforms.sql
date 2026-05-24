-- Add status and platform columns to releases table
ALTER TABLE releases
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS spotify_url TEXT,
  ADD COLUMN IF NOT EXISTS applemusic_url TEXT,
  ADD COLUMN IF NOT EXISTS deezer_url TEXT,
  ADD COLUMN IF NOT EXISTS soundcloud_url TEXT,
  ADD COLUMN IF NOT EXISTS youtube_video_id TEXT,
  ADD COLUMN IF NOT EXISTS youtube_upload_status TEXT NOT NULL DEFAULT 'not_uploaded';

-- Add check constraint for status values
ALTER TABLE releases
  DROP CONSTRAINT IF EXISTS releases_status_check;

ALTER TABLE releases
  ADD CONSTRAINT releases_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add check constraint for youtube_upload_status values
ALTER TABLE releases
  DROP CONSTRAINT IF EXISTS releases_youtube_upload_status_check;

ALTER TABLE releases
  ADD CONSTRAINT releases_youtube_upload_status_check
  CHECK (youtube_upload_status IN ('not_uploaded', 'uploading', 'uploaded', 'failed'));

-- Enable RLS on releases (safe to run multiple times)
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Drop existing select policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Artists can view own releases" ON releases;
DROP POLICY IF EXISTS "Admins can view all releases" ON releases;

-- Policy: artists (regular users) can only see their own releases
CREATE POLICY "Artists can view own releases" ON releases
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = uploaded_by
  );

-- Policy: admins can see all releases
-- Admins are identified via app_metadata.is_admin or the jwt role 'admin'/'service_role'
CREATE POLICY "Admins can view all releases" ON releases
  FOR SELECT
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- Allow artists to insert their own releases
DROP POLICY IF EXISTS "Artists can insert own releases" ON releases;

CREATE POLICY "Artists can insert own releases" ON releases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = uploaded_by
  );

-- Allow artists to update their own pending releases
DROP POLICY IF EXISTS "Artists can update own pending releases" ON releases;

CREATE POLICY "Artists can update own pending releases" ON releases
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = uploaded_by
    AND status = 'pending'
  )
  WITH CHECK (
    auth.uid() = uploaded_by
  );

-- Allow admins to update any release (e.g. to approve/reject)
DROP POLICY IF EXISTS "Admins can update any release" ON releases;

CREATE POLICY "Admins can update any release" ON releases
  FOR UPDATE
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );
