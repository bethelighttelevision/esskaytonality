-- Table for User Favorites
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  track_id uuid references public.releases(id) on delete cascade,
  youtube_id text, -- Used if they favorite a hardcoded youtube track
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, track_id), -- A user can only favorite a specific database track once
  unique (user_id, youtube_id) -- A user can only favorite a specific youtube track once
);

-- Enable RLS
alter table public.favorites enable row level security;

-- Users can only view their own favorites
create policy "Users can view own favorites" on public.favorites
  for select using (auth.uid() = user_id);

-- Users can only insert their own favorites
create policy "Users can insert own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

-- Users can only delete their own favorites
create policy "Users can delete own favorites" on public.favorites
  for delete using (auth.uid() = user_id);
