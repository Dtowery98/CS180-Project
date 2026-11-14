-- One profile per user created by the app right after sign-up
-- (signupService -> SupabaseDatabase.createProfile).
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Logged in students can see everyones profile (needed for matching)
create policy "Profiles are readable by logged-in users"
  on public.profiles for select
  to authenticated
  using (true);

-- Yoou can only create your own profile
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- you can only edit your own profile
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);