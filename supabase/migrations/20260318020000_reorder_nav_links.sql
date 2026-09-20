-- Header nav order: Home, Recent work, Case Studies, Blog, Get In Touch.

with ordered as (
  select
    id,
    row_number() over (
      order by
        case
          when href in ('#home', '/#home') then 1
          when href in ('#recent-work', '/#recent-work') then 2
          when href = '/case-studies' then 3
          when href = '/blog' then 4
          when href in ('#contact', '/#contact') then 5
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
