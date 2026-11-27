-- Which clubs each student joined One row = one student in one club.
create table public.student_clubs (
  student_id uuid    references public.profiles (id) on delete cascade,
  club_id    integer references public.clubs (id) on delete cascade,
  primary key (student_id, club_id)
);

alter table public.student_clubs enable row level security;

-- Logged-in students can see everyone's clubs (needed for matching)
create policy "Anyone logged in can read club picks"
  on public.student_clubs for select
  to authenticated
  using (true);

-- Students can only add/remove their own clubs
create policy "Students manage their own club picks"
  on public.student_clubs for all
  to authenticated
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);