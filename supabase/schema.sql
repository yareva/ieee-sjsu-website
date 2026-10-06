-- IEEE SJSU website — database setup.
-- Paste this whole file into Supabase → SQL Editor → Run. Safe to re-run.

-- Events, projects and workshops (one table; see src/lib/content.ts)
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'event' check (kind in ('event', 'project', 'workshop')),
  title        text not null,
  description  text not null default '',
  starts_at    timestamptz,
  date_label   text,
  time_label   text,
  location     text,
  category     text,
  flyer_url    text,
  photos       text[] not null default '{}',
  register_url text,
  featured     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Who may edit: officers' login emails
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

alter table public.events enable row level security;
alter table public.admins enable row level security;

drop policy if exists "events are public" on public.events;
drop policy if exists "admins add events" on public.events;
drop policy if exists "admins edit events" on public.events;
drop policy if exists "admins remove events" on public.events;
create policy "events are public"    on public.events for select using (true);
create policy "admins add events"    on public.events for insert to authenticated with check (public.is_admin());
create policy "admins edit events"   on public.events for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins remove events" on public.events for delete to authenticated using (public.is_admin());

drop policy if exists "admins can see themselves" on public.admins;
create policy "admins can see themselves" on public.admins for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Flyers and photos: a public bucket only admins can write to
insert into storage.buckets (id, name, public) values ('flyers', 'flyers', true)
  on conflict (id) do update set public = true;

drop policy if exists "flyers are public" on storage.objects;
drop policy if exists "admins upload flyers" on storage.objects;
drop policy if exists "admins replace flyers" on storage.objects;
drop policy if exists "admins delete flyers" on storage.objects;
create policy "flyers are public"     on storage.objects for select using (bucket_id = 'flyers');
create policy "admins upload flyers"  on storage.objects for insert to authenticated with check (bucket_id = 'flyers' and public.is_admin());
create policy "admins replace flyers" on storage.objects for update to authenticated using (bucket_id = 'flyers' and public.is_admin());
create policy "admins delete flyers"  on storage.objects for delete to authenticated using (bucket_id = 'flyers' and public.is_admin());

-- Add officers (their login emails), e.g.:
-- insert into public.admins (email) values ('officer@sjsu.edu');
-- Remove one:
-- delete from public.admins where email = 'officer@sjsu.edu';
