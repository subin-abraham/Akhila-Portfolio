-- Professional journey entries shown below the "Worked with" section.

create table public.professional_journey (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  organization text not null,
  location text,
  period text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.professional_journey enable row level security;

grant select on public.professional_journey to anon, authenticated;

create policy "Public read professional_journey"
  on public.professional_journey
  for select
  to anon, authenticated
  using (true);

insert into public.professional_journey (
  role,
  organization,
  location,
  period,
  description,
  sort_order
) values
  (
    'Embedded Systems Engineer',
    'Orbit Hardware Labs',
    'Bengaluru, India',
    '2024 — Present',
    'Designing firmware and board bring-up for sensor-rich IoT products — from schematic review through signal validation and production test fixtures.',
    1
  ),
  (
    'Electronics Design Intern',
    'NexCircuit Technologies',
    'Kochi, India',
    '2022 — 2024',
    'Built mixed-signal prototypes, ran oscilloscope and logic-analyzer debugging, and collaborated with mechanical teams on enclosure-aware PCB layouts.',
    2
  );
