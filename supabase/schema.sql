-- FG SSD Portal – Supabase schema
-- Ziel: sichere, rollenbasierte Verwaltung für SSD-Workflows.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('member', 'kursleitung', 'sekretariat')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.absences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  service text,
  note text,
  status text not null default 'neu' check (status in ('neu', 'gesehen', 'bestätigt', 'vertretung erforderlich', 'erledigt')),
  created_at timestamptz not null default now()
);

create table if not exists public.service_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  status text not null default 'aktiv' check (status in ('aktiv', 'vertretung', 'genehmigt', 'abgeschlossen')),
  created_at timestamptz not null default now()
);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references auth.users(id) on delete set null,
  building text not null,
  section text,
  floor text,
  room text,
  meeting_point text,
  support_type text not null,
  occurred_at timestamptz not null,
  orientation text,
  status text not null default 'eingegangen' check (status in ('eingegangen', 'gesehen', 'übernommen', 'abgeschlossen')),
  created_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  stock integer not null default 0,
  check_date date not null,
  status text not null default 'gut' check (status in ('gut', 'prüfen', 'nachbestellen')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  body text not null,
  target_role text default 'member' check (target_role in ('member', 'kursleitung', 'sekretariat', 'all')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Grundlegende Indizes
create index if not exists idx_absences_user_id on public.absences(user_id);
create index if not exists idx_service_assignments_user_id on public.service_assignments(user_id);
create index if not exists idx_incidents_reporter_user_id on public.incidents(reporter_user_id);
create index if not exists idx_materials_location on public.materials(location);
create index if not exists idx_notifications_user_id on public.notifications(user_id);

-- Beispiel: RLS aktivieren
alter table public.profiles enable row level security;
alter table public.absences enable row level security;
alter table public.service_assignments enable row level security;
alter table public.incidents enable row level security;
alter table public.materials enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Beispiel-Policies, angepasst an die reale Organisation
create policy "profiles_select_own_record"
on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_update_own_record"
on public.profiles for update using (auth.uid() = user_id);

create policy "absences_select_own_record"
on public.absences for select using (auth.uid() = user_id);
create policy "absences_insert_own_record"
on public.absences for insert with check (auth.uid() = user_id);

create policy "incidents_select_member_or_admin"
on public.incidents for select using (true);
create policy "incidents_insert_authenticated"
on public.incidents for insert with check (auth.role() = 'authenticated');

create policy "materials_select_authenticated"
on public.materials for select using (auth.role() = 'authenticated');
create policy "materials_update_authenticated"
on public.materials for update using (auth.role() = 'authenticated');

create policy "messages_select_authenticated"
on public.messages for select using (auth.role() = 'authenticated');
create policy "notifications_select_own_record"
on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update_own_record"
on public.notifications for update using (auth.uid() = user_id);

-- Hinweis:
-- In einer realen Produktionsumsetzung müssen die Policies detaillierter und
-- rollenbasiert angepasst werden. Für Kursleitung und Sekretariat gelten
-- zusätzlich separate Berechtigungsregeln.
