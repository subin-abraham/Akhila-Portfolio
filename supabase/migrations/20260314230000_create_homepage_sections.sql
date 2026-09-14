-- Editable section headers/copy for homepage sections (eyebrow, title, description).

create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  eyebrow text not null,
  title text not null,
  accent_title text,
  description text not null,
  highlight_target text not null default 'accent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_sections_key_not_blank check (
    char_length(trim(section_key)) > 0
  ),
  constraint homepage_sections_highlight_target_check check (
    highlight_target in ('title', 'accent')
  )
);

alter table public.homepage_sections enable row level security;

grant select on public.homepage_sections to anon, authenticated;

create policy "Public read homepage_sections"
  on public.homepage_sections
  for select
  to anon, authenticated
  using (true);

insert into public.homepage_sections (
  section_key,
  eyebrow,
  title,
  accent_title,
  description,
  highlight_target
) values
  (
    'professional_journey',
    'Experience',
    'Professional Journey',
    null,
    'Roles that shaped how I design, debug, and ship reliable electronics.',
    'title'
  ),
  (
    'education',
    'Academics',
    'Education',
    null,
    'Academic grounding in electronics, communication, and the problem-solving habits behind every prototype.',
    'title'
  ),
  (
    'technical_expertise',
    'Capabilities',
    'Technical',
    'Expertise',
    'Hardware-to-firmware range — the stack I use to take circuits from idea to a stable, testable build.',
    'accent'
  );
