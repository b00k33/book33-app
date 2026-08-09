-- Book33 cloud push — one-time database setup (2026-08-05).
-- Run in the Supabase SQL editor (or via the Management API) AFTER deploying
-- the b33-push Edge Function and setting its secrets. Idempotent.
-- 2026-08-09: moved to Book33's own project (mqaswzpuqqlujfhooplm), split off
-- from LCM (the pharmacy's project, jkpfhqaxhsiwtijxxzql) so the two apps no
-- longer share infra. The book33 table itself (owner/data/updated_at, RLS
-- scoped to auth.uid()=owner) isn't created here -- it predates this script
-- and was set up by hand; see the migration notes for its exact definition.

-- 1) Sent-marker table: a reminder fires ONCE even though the every-minute cron
--    re-reads the same queue. PK = (owner, tag, fire_at); the function's insert
--    conflicts on the second attempt and it skips. RLS on with NO policies:
--    only the service role (the function) can touch it.
create table if not exists public.b33_push_sent (
  owner uuid not null,
  tag text not null,
  fire_at bigint not null,
  sent_at timestamptz not null default now(),
  primary key (owner, tag, fire_at)
);
alter table public.b33_push_sent enable row level security;

-- 2) The every-minute tick. pg_cron + pg_net call the Edge Function over HTTP;
--    the x-b33-key header must match the function's B33_CRON_KEY secret.
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- re-running setup replaces the old schedule instead of stacking a second one
select cron.unschedule('b33-push-tick')
where exists (select 1 from cron.job where jobname = 'b33-push-tick');

select cron.schedule(
  'b33-push-tick',
  '* * * * *',
  $$
  select net.http_post(
    url     := 'https://jkpfhqaxhsiwtijxxzql.supabase.co/functions/v1/b33-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-b33-key',    'DwUUAAdKNePNgEyYcLxMUS4YUxieZ2Dp'
    ),
    body    := '{}'::jsonb
  );
  $$
);
