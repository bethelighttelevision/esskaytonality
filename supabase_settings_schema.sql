-- Table for Platform Settings (Hero Carousel, SEO, etc)
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.settings enable row level security;

-- Everyone can view settings (for the frontend to load banners)
create policy "Settings are viewable by everyone." on public.settings
  for select using (true);

-- Only Admins can insert/update settings
create policy "Only Admins can modify settings." on public.settings
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert dummy data for hero_carousel to prevent empty states
insert into public.settings (key, value)
values (
  'hero_carousel', 
  '[{"id": "s1", "title": "Saiyaara", "image": "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg", "youtubeId": "gCsv3X5ofhI"}]'::jsonb
) on conflict (key) do nothing;
