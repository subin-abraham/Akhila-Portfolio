-- Editable footer brand copy and link columns for the homepage.

create table public.footer (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  tagline text not null,
  status_label text not null,
  cta_label text not null,
  cta_href text not null,
  copyright_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.footer_links (
  id uuid primary key default gen_random_uuid(),
  column_key text not null,
  column_title text not null,
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  column_sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint footer_links_column_key_not_blank check (
    char_length(trim(column_key)) > 0
  ),
  constraint footer_links_label_not_blank check (
    char_length(trim(label)) > 0
  ),
  constraint footer_links_href_not_blank check (
    char_length(trim(href)) > 0
  )
);

alter table public.footer enable row level security;
alter table public.footer_links enable row level security;

grant select on public.footer to anon, authenticated;
grant select on public.footer_links to anon, authenticated;

create policy "Public read footer"
  on public.footer
  for select
  to anon, authenticated
  using (true);

create policy "Public read footer_links"
  on public.footer_links
  for select
  to anon, authenticated
  using (true);

insert into public.footer (
  brand_name,
  tagline,
  status_label,
  cta_label,
  cta_href,
  copyright_name
) values (
  'Akhila',
  'Electronics engineer focused on embedded systems, circuit design, and signal processing.',
  'Open to collaborations',
  'Let''s get started',
  '#contact',
  'Akhila Anns Jacob'
);

insert into public.footer_links (
  column_key,
  column_title,
  label,
  href,
  sort_order,
  column_sort_order
) values
  ('explore', 'Explore', 'Home', '#home', 1, 1),
  ('explore', 'Explore', 'Case Studies', '#case-studies', 2, 1),
  ('explore', 'Explore', 'Testimonials', '#testimonials', 3, 1),
  ('explore', 'Explore', 'Recent work', '#recent-work', 4, 1),
  ('explore', 'Explore', 'Get In Touch', '#contact', 5, 1),
  ('about', 'About', 'Experience', '#professional-journey', 1, 2),
  ('about', 'About', 'Education', '#education', 2, 2),
  ('about', 'About', 'Expertise', '#technical-expertise', 3, 2),
  ('about', 'About', 'Toolkit', '#tools-and-technology', 4, 2),
  ('connect', 'Connect', 'Let''s get started', '#contact', 1, 3),
  ('connect', 'Connect', 'LinkedIn', 'https://www.linkedin.com/', 2, 3),
  ('connect', 'Connect', 'Behance', 'https://www.behance.net/', 3, 3),
  ('connect', 'Connect', 'Twitter', 'https://twitter.com/', 4, 3);
