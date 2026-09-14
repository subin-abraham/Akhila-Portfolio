-- Extend homepage_sections for journey/education copy + title highlight control.
-- Safe to run if 20260314230000 already created the base table.

alter table public.homepage_sections
  add column if not exists highlight_target text;

update public.homepage_sections
set highlight_target = 'accent'
where highlight_target is null;

alter table public.homepage_sections
  alter column highlight_target set default 'accent';

alter table public.homepage_sections
  alter column highlight_target set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'homepage_sections_highlight_target_check'
  ) then
    alter table public.homepage_sections
      add constraint homepage_sections_highlight_target_check check (
        highlight_target in ('title', 'accent')
      );
  end if;
end $$;

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
  )
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent_title = excluded.accent_title,
  description = excluded.description,
  highlight_target = excluded.highlight_target,
  updated_at = now();

update public.homepage_sections
set
  highlight_target = 'accent',
  updated_at = now()
where section_key = 'technical_expertise';
