-- Contact section copy (messages are emailed via Resend, not stored).

insert into public.homepage_sections (
  section_key,
  eyebrow,
  title,
  accent_title,
  description,
  highlight_target
) values
  (
    'contact',
    'Contact',
    'Get in',
    'Touch',
    'Have a project, collaboration, or role in mind? Send a note — I usually reply within a few days.',
    'accent'
  )
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent_title = excluded.accent_title,
  description = excluded.description,
  highlight_target = excluded.highlight_target,
  updated_at = now();

drop table if exists public.contact_messages;
