-- Seed initial labels for Esskaytonality (run once)
-- Logo URLs are null — initials fallback will show (EO, EH, EI)

insert into public.labels (name, slug, tagline, description, color, genre, display_order, is_active)
values
  (
    'Esskay Originals',
    'esskay-originals',
    'Original compositions and acoustic masterpieces',
    'The flagship division of Esskaytonality, featuring original compositions that blend contemporary pop with timeless acoustic elements. Home to Sahir Alam and our core roster of singer-songwriters.',
    '#f59e0b',
    'Pop / Acoustic',
    1,
    true
  ),
  (
    'Esskay Hip Hop',
    'esskay-hip-hop',
    'The voice of the streets',
    'A gritty, unapologetic dive into hip hop and rap. Esskay Hip Hop represents the raw energy of urban storytelling, boom-bap production, and next-level lyricism from the freshest voices in the scene.',
    '#ef4444',
    'Hip Hop / Rap',
    2,
    true
  ),
  (
    'Esskay Indie',
    'esskay-indie',
    'Where independent artists thrive',
    'A home for indie, alternative, and experimental artists who push boundaries. Esskay Indie is where genre-blending meets creative freedom — the future of sound starts here.',
    '#8b5cf6',
    'Indie / Alternative',
    3,
    true
  )
on conflict (slug) do nothing;
