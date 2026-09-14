-- Tools and technology inventory for the homepage (distinct from skill proficiency).

create table public.tools_and_technology (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.tools_and_technology enable row level security;

grant select on public.tools_and_technology to anon, authenticated;

create policy "Public read tools_and_technology"
  on public.tools_and_technology
  for select
  to anon, authenticated
  using (true);

insert into public.tools_and_technology (category, name, sort_order) values
  ('Languages', 'C / C++', 1),
  ('Languages', 'Python', 2),
  ('Languages', 'MATLAB', 3),
  ('Languages', 'Embedded C', 4),
  ('CAD & Layout', 'KiCad', 5),
  ('CAD & Layout', 'Altium Designer', 6),
  ('CAD & Layout', 'Schematic Capture', 7),
  ('CAD & Layout', 'PCB Stackup', 8),
  ('Lab Bench', 'Oscilloscope', 9),
  ('Lab Bench', 'Logic Analyzer', 10),
  ('Lab Bench', 'Multimeter', 11),
  ('Lab Bench', 'Signal Generator', 12),
  ('Firmware Stack', 'STM32Cube', 13),
  ('Firmware Stack', 'PlatformIO', 14),
  ('Firmware Stack', 'FreeRTOS', 15),
  ('Firmware Stack', 'JTAG / SWD', 16),
  ('Workflow', 'Git', 17),
  ('Workflow', 'Documentation', 18),
  ('Workflow', 'Test Automation', 19),
  ('Workflow', 'Versioned Releases', 20);

insert into public.homepage_sections (
  section_key,
  eyebrow,
  title,
  accent_title,
  description,
  highlight_target
) values
  (
    'tools_and_technology',
    'Toolkit',
    'Tools',
    '& Technology',
    'The everyday stack I reach for — from schematic capture and firmware tooling to the bench instruments that prove a design.',
    'accent'
  )
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent_title = excluded.accent_title,
  description = excluded.description,
  highlight_target = excluded.highlight_target,
  updated_at = now();

delete from public.technical_expertise
where category = 'Tools & Workflow';
