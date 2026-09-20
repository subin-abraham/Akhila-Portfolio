-- Admin server actions use the secret key (service_role). Content tables were
-- created with public read grants only, so writes failed with permission errors.

grant select, insert, update, delete on
  public.homepage,
  public.homepage_sections,
  public.nav_links,
  public.social_links,
  public.worked_with,
  public.professional_journey,
  public.education,
  public.blog_posts,
  public.case_studies,
  public.technical_expertise,
  public.tools_and_technology,
  public.footer,
  public.footer_links
to service_role;
