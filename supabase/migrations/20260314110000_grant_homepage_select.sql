-- Fix: RLS policies alone are not enough; anon/authenticated need table grants.
grant select on public.homepage to anon, authenticated;
grant select on public.nav_links to anon, authenticated;
grant select on public.social_links to anon, authenticated;
grant select on public.worked_with to anon, authenticated;
