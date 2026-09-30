-- Also cleans duplicate Blog + placeholder Testimonials nav links.
-- Case Studies live on /case-studies (see 20260318010000).

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  period text not null,
  summary text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.case_studies enable row level security;

grant select on public.case_studies to anon, authenticated;

create policy "Public read case_studies"
  on public.case_studies
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
    'case_studies',
    'Selected work',
    'Case',
    'Studies',
    'Project deep-dives — the problem, the approach, and what shipped on the board.',
    'accent'
  )
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent_title = excluded.accent_title,
  description = excluded.description,
  highlight_target = excluded.highlight_target,
  updated_at = now();

insert into public.case_studies (
  title,
  client,
  period,
  summary,
  description,
  sort_order
) values
  (
    'Low-Power Sensor Node for Industrial Monitoring',
    'Confidential manufacturing client',
    '2024',
    'Designed a battery-backed STM32 node that samples vibration and temperature for 18+ months on a single cell.',
    'Scoped the power budget, selected a low-Iq PMIC and sensor set, and brought up FreeRTOS firmware with duty-cycled radios. The first pilot units ran through a full production shift without a brownout — and the PCB layout left room for a second ADC channel the client added mid-project.',
    1
  ),
  (
    'USB-C PD Bring-Up on a Custom Dock',
    'Consumer electronics prototype',
    '2025',
    'Debugged negotiation failures between a PD controller and host SoC so the dock could charge and data-switch reliably.',
    'Caught a CC pin swap on the Type-C connector and a missing dead-battery pull-up that only failed on cold plug. After the respin, PD contracts settled within spec and USB3 SuperSpeed stayed stable under cable wiggle tests.',
    2
  );

delete from public.nav_links
where href in ('#case-studies', '#testimonials')
   or lower(label) in ('case studies', 'testimonials');

delete from public.nav_links
where href in ('/blog', '#blog')
   or lower(label) = 'blog';

insert into public.nav_links (label, href, sort_order)
select 'Blog', '/blog', coalesce(max(sort_order), 0) + 1
from public.nav_links;

with ordered as (
  select
    id,
    row_number() over (
      order by
        case href
          when '#home' then 1
          when '#recent-work' then 2
          when '#contact' then 3
          when '/blog' then 4
          else 50
        end,
        sort_order,
        label
    ) as next_sort
  from public.nav_links
)
update public.nav_links as links
set sort_order = ordered.next_sort
from ordered
where links.id = ordered.id;

delete from public.footer_links
where column_key = 'explore'
  and (
    href in ('#testimonials')
    or lower(label) = 'testimonials'
  );

update public.footer_links
set href = '#case-studies', label = 'Case Studies'
where column_key = 'explore'
  and (
    href = '#case-studies'
    or lower(label) = 'case studies'
  );

insert into public.footer_links (
  column_key,
  column_title,
  label,
  href,
  sort_order,
  column_sort_order
)
select 'explore', 'Explore', 'Blog', '/blog', 6, 1
where not exists (
  select 1
  from public.footer_links
  where column_key = 'explore' and href = '/blog'
);

with explore_ordered as (
  select
    id,
    row_number() over (
      order by
        case href
          when '#home' then 1
          when '#case-studies' then 2
          when '/blog' then 3
          when '#recent-work' then 4
          when '#contact' then 5
          else 50
        end,
        sort_order,
        label
    ) as next_sort
  from public.footer_links
  where column_key = 'explore'
)
update public.footer_links as links
set sort_order = explore_ordered.next_sort
from explore_ordered
where links.id = explore_ordered.id;
