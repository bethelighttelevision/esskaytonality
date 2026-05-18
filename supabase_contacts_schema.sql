-- Create a table for contact form submissions
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) for security
alter table public.contacts enable row level security;

-- Policy: Allow ANY guest or visitor to submit (insert) contact messages
create policy "Anyone can insert contact messages." on public.contacts
  for insert with check (true);

-- Policy: Only ADMINS can view (select) or modify contact submissions
create policy "Only admins can view contact messages." on public.contacts
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete contact messages." on public.contacts
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
