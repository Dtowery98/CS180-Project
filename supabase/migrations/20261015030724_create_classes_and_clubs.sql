-- UCR class schedule tables.
-- Source: UCR_Fall_2026_data (registration snapshot). Data is loaded by supabase/seed.sql.
--
--   courses  1 row per course code       e.g. 'CS 180'
--   sections 1 row per section (CRN)     e.g. CS 180 lecture 001, CS 180 lab 021
--   meetings 1 row per meeting time      a section can meet more than once a week
--
-- Students will pick sections, so matching = students who share a section (or course).

create table public.courses (
  course_code   text primary key,              -- 'CS 180'
  subject       text not null,                 -- 'CS'
  course_number text not null,                 -- '180' (keeps leading zeros, e.g. '006')
  title         text not null,
  college       text,
  department    text,
  units_min     numeric,
  units_max     numeric,
  description   text
);

create table public.sections (
  term_code       text not null,               -- '202640' = Fall 2026
  crn             text not null,               -- course reference number, e.g. '42226'
  course_code     text not null references public.courses (course_code),
  section         text not null,               -- '001', '021'
  class_type      text,                        -- Lecture, Discussion, Laboratory, ...
  instructors     text,                        -- 'Last, First; Last, First'
  units_min       numeric,
  units_max       numeric,
  capacity        integer,
  enrollment      integer,
  seats_available integer,
  delivery_method text,                        -- In-Person / Online
  is_linked       boolean,                     -- true if it must be taken with a linked lab/discussion
  link_identifier text,
  primary key (term_code, crn)
);

create table public.meetings (
  id             bigint generated always as identity primary key,
  term_code      text not null,
  crn            text not null,
  meeting_number integer,
  meeting_type   text,                         -- Lecture, Discussion, ...
  days           text[],                       -- {'Tue','Thu'}; null when TBA
  start_time     time,                         -- campus local time; null when TBA
  end_time       time,
  start_date     date,
  end_date       date,
  building       text,
  room           text,
  foreign key (term_code, crn) references public.sections (term_code, crn) on delete cascade
);

create index sections_course_code_idx on public.sections (course_code);
create index meetings_section_idx     on public.meetings (term_code, crn);

-- Supabase exposes public tables through its API, so turn on row level security.
-- The schedule is public info: anyone can read it, nobody can edit it from the app.
alter table public.courses  enable row level security;
alter table public.sections enable row level security;
alter table public.meetings enable row level security;

create policy "Courses are readable by everyone"  on public.courses  for select using (true);
create policy "Sections are readable by everyone" on public.sections for select using (true);
create policy "Meetings are readable by everyone" on public.meetings for select using (true);
