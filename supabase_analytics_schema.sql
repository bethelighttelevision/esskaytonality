-- 1. Add play_count column to public.releases
alter table public.releases 
add column if not exists play_count integer default 0 not null;

-- 2. Create RPC function to increment play count securely
create or replace function public.increment_play_count(release_id uuid)
returns void as $$
begin
  update public.releases
  set play_count = play_count + 1
  where id = release_id;
end;
$$ language plpgsql security definer;

-- 3. Grant execute permissions to public/anon/authenticated
grant execute on function public.increment_play_count(uuid) to anon, authenticated, service_role;
