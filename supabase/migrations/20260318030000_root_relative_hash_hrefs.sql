-- Root-relative homepage anchors so hash links work from /blog and /case-studies.

update public.nav_links
set href = '/' || href
where href like '#%';

update public.footer_links
set href = '/' || href
where href like '#%';

update public.homepage
set cta_href = '/' || cta_href
where cta_href like '#%';

update public.footer
set cta_href = '/' || cta_href
where cta_href like '#%';
