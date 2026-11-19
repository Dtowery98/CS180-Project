--sections that each student is taking
create table student_sections (
  student_id uuid references public.profiles(id),
  term_code text not null,
  crn text not null,
  primary key (student_id, term_code,crn),
  foreign key (term_code, crn) references public.sections(term_code, crn) 
);
alter table public.student_sections enable row level security;

create policy "Students can see others sections"
    on public.student_sections for select
    to authenticated
    using (true);

-- students can only change their own sections
create policy "Students can update their own sections"
    on public.student_sections for all
    to authenticated
    using (student_id = auth.uid());