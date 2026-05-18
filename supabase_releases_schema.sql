-- 1. Create a table for Music Releases
create table public.releases (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist_name text not null,
  genre text,
  cover_image_url text,
  audio_url text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.releases enable row level security;

-- Policies for Database Table
create policy "Releases are viewable by everyone." on public.releases
  for select using (true);

create policy "Admins and Artists can insert releases." on public.releases
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'artist')
    )
  );

create policy "Users can update their own releases." on public.releases
  for update using (auth.uid() = uploaded_by or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can delete their own releases." on public.releases
  for delete using (auth.uid() = uploaded_by or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- 2. Create Storage Bucket for heavy MP3s and Images
insert into storage.buckets (id, name, public) 
values ('releases', 'releases', true)
on conflict (id) do nothing;

-- Policies for Storage Bucket
create policy "Public Access to files" on storage.objects 
  for select using ( bucket_id = 'releases' );

create policy "Admin and Artist Upload files" on storage.objects 
  for insert with check (
    bucket_id = 'releases' and 
    auth.role() = 'authenticated' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'artist')
    )
  );
