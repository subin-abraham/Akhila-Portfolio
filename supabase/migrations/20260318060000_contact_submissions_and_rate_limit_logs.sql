-- Persist contact form submissions and rate-limit events (server/service writes only).

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  ip_address text,
  forwarded_for text,
  user_agent text,
  referer text,
  origin text,
  host text,
  accept_language text,
  request_path text,
  honeypot_triggered boolean not null default false,
  email_status text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  email_error text,
  email_provider_id text,
  email_to text,
  email_from text,
  email_subject text,
  created_at timestamptz not null default now(),
  email_sent_at timestamptz
);

create table public.contact_rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  client_key text not null,
  ip_address text,
  forwarded_for text,
  user_agent text,
  referer text,
  origin text,
  host text,
  accept_language text,
  request_path text,
  attempt_count integer not null,
  max_requests integer not null,
  window_ms integer not null,
  reset_at timestamptz,
  remaining_ms integer,
  name text,
  email text,
  subject text,
  message_preview text,
  message_length integer,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
alter table public.contact_rate_limit_events enable row level security;

grant select, insert, update on public.contact_submissions to service_role;
grant select, insert on public.contact_rate_limit_events to service_role;

create index contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create index contact_submissions_email_status_idx
  on public.contact_submissions (email_status);

create index contact_rate_limit_events_created_at_idx
  on public.contact_rate_limit_events (created_at desc);

create index contact_rate_limit_events_ip_idx
  on public.contact_rate_limit_events (ip_address);
