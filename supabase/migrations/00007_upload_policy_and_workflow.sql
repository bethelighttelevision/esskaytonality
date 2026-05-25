-- Add policy-related columns to releases table
ALTER TABLE releases ADD COLUMN IF NOT EXISTS policy_accepted BOOLEAN DEFAULT false;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS policy_accepted_at TIMESTAMPTZ;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS policy_version TEXT;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create upload_policies table
CREATE TABLE IF NOT EXISTS upload_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default policy (placeholder — replace with real policy text later)
INSERT INTO upload_policies (version, content) VALUES 
('v1', 'By submitting this release, you confirm that you own all necessary rights to the audio and visual content. You grant ESSKAYTONALITY non-exclusive rights to distribute this content across our platforms.')
ON CONFLICT (version) DO NOTHING;

-- Enable RLS on upload_policies
ALTER TABLE upload_policies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active policies
DROP POLICY IF EXISTS "Anyone can read active policies" ON upload_policies;
CREATE POLICY "Anyone can read active policies" ON upload_policies
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Allow admins to manage policies
DROP POLICY IF EXISTS "Admins can manage policies" ON upload_policies;
CREATE POLICY "Admins can manage policies" ON upload_policies
  FOR ALL
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false')::boolean
    OR auth.jwt() ->> 'role' IN ('admin', 'service_role')
  );

-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
