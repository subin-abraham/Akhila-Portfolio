-- Homepage content for the portfolio landing page.
-- Profile image is served from the app (public/images/profile.jpg), not Supabase.

create table public.homepage (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  intro text not null,
  cta_label text not null,
  cta_href text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint social_links_platform_check check (
    platform in ('linkedin', 'behance', 'twitter')
  )
);

create table public.worked_with (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.homepage enable row level security;
alter table public.nav_links enable row level security;
alter table public.social_links enable row level security;
alter table public.worked_with enable row level security;

grant select on public.homepage to anon, authenticated;
grant select on public.nav_links to anon, authenticated;
grant select on public.social_links to anon, authenticated;
grant select on public.worked_with to anon, authenticated;

create policy "Public read homepage"
  on public.homepage
  for select
  to anon, authenticated
  using (true);

create policy "Public read nav_links"
  on public.nav_links
  for select
  to anon, authenticated
  using (true);

create policy "Public read social_links"
  on public.social_links
  for select
  to anon, authenticated
  using (true);

create policy "Public read worked_with"
  on public.worked_with
  for select
  to anon, authenticated
  using (true);

insert into public.homepage (full_name, intro, cta_label, cta_href)
values (
  'Akhila Anns Jacob',
  'Electronics engineer focused on embedded systems, circuit design, and signal processing. I turn complex hardware ideas into reliable products — from schematic to prototype.',
  'Let''s get started',
  '#contact'
);

insert into public.nav_links (label, href, sort_order) values
  ('Home', '#home', 1),
  ('Case Studies', '#case-studies', 2),
  ('Testimonials', '#testimonials', 3),
  ('Recent work', '#recent-work', 4),
  ('Get In Touch', '#contact', 5);

insert into public.social_links (platform, href, sort_order) values
  ('linkedin', 'https://www.linkedin.com/', 1),
  ('behance', 'https://www.behance.net/', 2),
  ('twitter', 'https://twitter.com/', 3);

insert into public.worked_with (name, logo_url, sort_order) values
  ('ClickUp', '/logos/clickup.svg', 1),
  ('Dropbox', '/logos/dropbox.svg', 2),
  ('PAYCHEX', '/logos/paychex.svg', 3),
  ('elastic', '/logos/elastic.svg', 4),
  ('stripe', '/logos/stripe.svg', 5);
