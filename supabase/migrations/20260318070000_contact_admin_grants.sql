-- Allow service-role deletes from the contact admin inbox.

grant delete on public.contact_submissions to service_role;
grant delete on public.contact_rate_limit_events to service_role;
