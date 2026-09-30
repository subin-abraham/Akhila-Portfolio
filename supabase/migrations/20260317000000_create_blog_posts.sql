-- Blog posts for the standalone /blog page.

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  body text not null,
  published_on date not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

grant select on public.blog_posts to anon, authenticated;

create policy "Public read blog_posts"
  on public.blog_posts
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
    'blog',
    'Writing',
    'Blog',
    null,
    'Notes on hardware design, firmware, and the craft of building reliable electronics.',
    'title'
  )
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent_title = excluded.accent_title,
  description = excluded.description,
  highlight_target = excluded.highlight_target,
  updated_at = now();

insert into public.blog_posts (
  title,
  slug,
  excerpt,
  body,
  published_on,
  sort_order
) values
  (
    'Debugging a Flaky I2C Bus on the Bench',
    'debugging-flaky-i2c-bus',
    'A walk through pull-ups, clock stretching, and the scope capture that finally explained intermittent NACKs on a multi-device bus.',
    E'Intermittent I2C failures are the kind of bug that only shows up after you ship the board. On one recent design, a sensor would ACK cleanly for hours and then start NACKing with no obvious pattern.

The first pass looked fine on paper: 4.7k pull-ups, short traces, a 400 kHz clock. The logic analyzer showed the address byte leaving the host correctly, but the ninth clock edge occasionally arrived with SDA still high.

Two things mattered. First, one of the peripheral devices was stretching the clock longer than the host''s timeout expected under a heavy interrupt load. Second, the combined bus capacitance meant the rise time was slower than the datasheet assumed for that pull-up value.

Dropping to 2.2k pull-ups tightened the edges, and giving the host a slightly longer stretch timeout removed the remaining NACKs. The scope capture that sealed it was a single frame where SDA was still climbing when the host sampled the ACK bit.

If you are chasing a flaky bus, measure rise time before you rewrite the driver. The waveform usually tells the truth faster than the firmware.',
    '2026-03-10',
    1
  );

insert into public.nav_links (label, href, sort_order)
select 'Blog', '/blog', coalesce(max(sort_order), 0) + 1
from public.nav_links
where not exists (
  select 1 from public.nav_links where href in ('/blog', '#blog')
);

update public.nav_links
set href = '/blog'
where href = '#blog';
