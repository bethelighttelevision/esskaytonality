-- Comprehensive team seed data
INSERT INTO team_members (name, category, title, bio, display_order, is_active) VALUES
  ('Sahir Alam', 'Founder & CEO', 'Founder & Chief Executive Officer', 'Visionary leader and founder of ESSKAYTONALITY, dedicated to shaping the future of music and artist development.', 1, true),
  ('Aisha Khan', 'Management', 'Chief Operating Officer', NULL, 1, true),
  ('Ravi Patel', 'Management', 'Head of Operations', NULL, 2, true),
  ('Marcus Chen', 'Technical Media', 'Head of Technical Media', NULL, 1, true),
  ('Priya Sharma', 'Technical Media', 'Media Production Manager', NULL, 2, true),
  ('James Wilson', 'Writers', 'Lead Songwriter', NULL, 1, true),
  ('Zara Ahmed', 'Writers', 'Staff Writer', NULL, 2, true),
  ('David Kim', 'Composers', 'Lead Composer', NULL, 1, true),
  ('Elena Torres', 'Composers', 'Composer & Arranger', NULL, 2, true),
  ('Alex Rivera', 'Band', 'Lead Guitarist', NULL, 1, true),
  ('Sam Johnson', 'Band', 'Drummer', NULL, 2, true),
  ('Maya Singh', 'Band', 'Bassist', NULL, 3, true),
  ('Omar Hassan', 'Band', 'Keyboardist', NULL, 4, true),
  ('Chris Thompson', 'Mixing & Mastering Engineers', 'Head of Mixing & Mastering', NULL, 1, true),
  ('Nina Patel', 'Mixing & Mastering Engineers', 'Mastering Engineer', NULL, 2, true),
  ('Tom Baker', 'Sound Engineers', 'Senior Sound Engineer', NULL, 1, true),
  ('Lena Schmidt', 'Sound Engineers', 'Recording Engineer', NULL, 2, true),
  ('Carlos Mendez', 'Arrangers Artist', 'Lead Arranger', NULL, 1, true),
  ('Yuki Tanaka', 'Arrangers Artist', 'Orchestral Arranger', NULL, 2, true)
ON CONFLICT DO NOTHING;
