-- Technical expertise skills grouped by category on the homepage.

create table public.technical_expertise (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  skill text not null,
  proficiency integer not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint technical_expertise_proficiency_check check (
    proficiency >= 0 and proficiency <= 100
  )
);

alter table public.technical_expertise enable row level security;

grant select on public.technical_expertise to anon, authenticated;

create policy "Public read technical_expertise"
  on public.technical_expertise
  for select
  to anon, authenticated
  using (true);

insert into public.technical_expertise (
  category,
  skill,
  proficiency,
  sort_order
) values
  ('Embedded Systems', 'C / C++ Firmware', 92, 1),
  ('Embedded Systems', 'STM32 / ARM Cortex', 88, 2),
  ('Embedded Systems', 'RTOS & Interrupts', 84, 3),
  ('Embedded Systems', 'SPI / I2C / UART', 90, 4),
  ('Circuit Design', 'Schematic Capture', 86, 5),
  ('Circuit Design', 'PCB Layout', 82, 6),
  ('Circuit Design', 'Mixed-Signal Debug', 80, 7),
  ('Circuit Design', 'Power Electronics Basics', 74, 8),
  ('Signal Processing', 'Filter Design', 78, 9),
  ('Signal Processing', 'ADC / DAC Systems', 81, 10),
  ('Signal Processing', 'MATLAB / Simulation', 76, 11),
  ('Tools & Workflow', 'KiCad / Altium', 85, 12),
  ('Tools & Workflow', 'Oscilloscope & Logic Analyzer', 88, 13),
  ('Tools & Workflow', 'Git & Documentation', 83, 14),
  ('Tools & Workflow', 'Python for Test Automation', 79, 15);
