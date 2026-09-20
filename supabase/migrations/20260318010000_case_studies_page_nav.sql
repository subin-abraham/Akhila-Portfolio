-- Point Case Studies links at the dedicated /case-studies page.

update public.nav_links
set href = '/case-studies', label = 'Case Studies'
where href in ('#case-studies', '/case-studies')
   or lower(label) = 'case studies';

insert into public.nav_links (label, href, sort_order)
select 'Case Studies', '/case-studies', coalesce(max(sort_order), 0) + 1
from public.nav_links
where not exists (
  select 1
  from public.nav_links
  where href = '/case-studies' or lower(label) = 'case studies'
);

with ordered as (
  select
    id,
    row_number() over (
      order by
        case href
          when '#home' then 1
          when '#recent-work' then 2
          when '/case-studies' then 3
          when '/blog' then 4
          when '#contact' then 5
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

update public.footer_links
set href = '/case-studies', label = 'Case Studies'
where column_key = 'explore'
  and (
    href in ('#case-studies', '/case-studies')
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
select 'explore', 'Explore', 'Case Studies', '/case-studies', 2, 1
where not exists (
  select 1
  from public.footer_links
  where column_key = 'explore'
    and (href = '/case-studies' or lower(label) = 'case studies')
);

with explore_ordered as (
  select
    id,
    row_number() over (
      order by
        case href
          when '#home' then 1
          when '/case-studies' then 2
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
