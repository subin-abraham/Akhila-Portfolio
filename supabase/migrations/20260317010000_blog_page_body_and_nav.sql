-- Upgrade blog posts for the /blog page + reading modal (safe if create migration already ran).

alter table public.blog_posts
  add column if not exists body text;

alter table public.blog_posts
  drop column if exists href;

update public.blog_posts
set body = coalesce(
  nullif(trim(body), ''),
  excerpt
)
where body is null or trim(body) = '';

alter table public.blog_posts
  alter column body set not null;

update public.blog_posts
set body = E'Intermittent I2C failures are the kind of bug that only shows up after you ship the board. On one recent design, a sensor would ACK cleanly for hours and then start NACKing with no obvious pattern.

The first pass looked fine on paper: 4.7k pull-ups, short traces, a 400 kHz clock. The logic analyzer showed the address byte leaving the host correctly, but the ninth clock edge occasionally arrived with SDA still high.

Two things mattered. First, one of the peripheral devices was stretching the clock longer than the host''s timeout expected under a heavy interrupt load. Second, the combined bus capacitance meant the rise time was slower than the datasheet assumed for that pull-up value.

Dropping to 2.2k pull-ups tightened the edges, and giving the host a slightly longer stretch timeout removed the remaining NACKs. The scope capture that sealed it was a single frame where SDA was still climbing when the host sampled the ACK bit.

If you are chasing a flaky bus, measure rise time before you rewrite the driver. The waveform usually tells the truth faster than the firmware.'
where slug = 'debugging-flaky-i2c-bus'
  and length(body) <= length(excerpt) + 20;

update public.nav_links
set href = '/blog'
where href = '#blog';

insert into public.nav_links (label, href, sort_order)
select 'Blog', '/blog', coalesce(max(sort_order), 0) + 1
from public.nav_links
where not exists (
  select 1 from public.nav_links where href = '/blog'
);
