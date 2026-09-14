-- Education entries shown as their own homepage section.

create table public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text,
  period text not null,
  grade text,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.education enable row level security;

grant select on public.education to anon, authenticated;

create policy "Public read education"
  on public.education
  for select
  to anon, authenticated
  using (true);

insert into public.education (
  degree,
  institution,
  location,
  period,
  grade,
  description,
  sort_order
) values
  (
    'B.Tech, Electronics & Communication Engineering',
    'APJ Abdul Kalam Technological University',
    'Kerala, India',
    '2018 — 2022',
    'CGPA 6.9 / 10',
    'Built a foundation in digital electronics, microcontrollers, and signal processing with hands-on embedded C and circuit simulation projects.',
    1
  ),
  (
    'Higher Secondary, Science',
    'St. Mary''s Higher Secondary School',
    'Kerala, India',
    '2016 — 2018',
    null,
    'Focused on physics, mathematics, and computer science — the spark that led into electronics and hardware design.',
    2
  );

delete from public.professional_journey
where role = 'B.Tech, Electronics & Communication'
  and organization = 'APJ Abdul Kalam Technological University';
