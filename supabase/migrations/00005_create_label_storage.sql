-- Create label-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('label-logos', 'label-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Public can view label logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload label logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update label logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete label logos" ON storage.objects;

-- Policy: public can view
CREATE POLICY "Public can view label logos" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'label-logos');

-- Policy: admins can upload
CREATE POLICY "Admins can upload label logos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'label-logos'
    AND (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
      OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
    )
  );

-- Policy: admins can update
CREATE POLICY "Admins can update label logos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'label-logos'
    AND (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
      OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
    )
  );

-- Policy: admins can delete
CREATE POLICY "Admins can delete label logos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'label-logos'
    AND (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
      OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
    )
  );
