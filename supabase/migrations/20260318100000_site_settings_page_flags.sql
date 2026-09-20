drop table if exists public.site_settings;

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  blog_enabled boolean not null default true,
  case_studies_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

insert into public.site_settings (blog_enabled, case_studies_enabled)
values (true, true);

grant select on public.site_settings to anon, authenticated;
grant select, update on public.site_settings to service_role;

create policy "Public read site_settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);
