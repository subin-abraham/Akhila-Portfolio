alter table public.site_settings
  add column if not exists theme_toggle_enabled boolean not null default true;

alter table public.site_settings
  add column if not exists default_theme text not null default 'dark';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'site_settings_default_theme_check'
  ) then
    alter table public.site_settings
      add constraint site_settings_default_theme_check
      check (default_theme in ('light', 'dark', 'system'));
  end if;
end $$;

update public.site_settings
set
  theme_toggle_enabled = coalesce(theme_toggle_enabled, true),
  default_theme = coalesce(default_theme, 'dark');
