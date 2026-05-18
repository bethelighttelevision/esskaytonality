-- Create a table for public profiles (Handles both Users and Artists)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'user' check (role in ('user', 'artist', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) for security
alter table public.profiles enable row level security;

-- Create policies so users can only edit their own data
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- Function: Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Fires the function above every time someone registers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Run this to sync the account you just created (Victor) into the new profiles table
insert into public.profiles (id, email, full_name, role)
select id, email, raw_user_meta_data->>'full_name', coalesce(raw_user_meta_data->>'role', 'user')
from auth.users
on conflict (id) do nothing;
