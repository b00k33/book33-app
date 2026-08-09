# Book33 cloud push — deploy checklist

Everything client-side already ships with the app (subscription in
`book33-push-sub`, precomputed queue in `book33-push-queue`, sw.js `push`
handler). This folder is the server half. Nothing here re-implements reminder
logic — the function only delivers what the app computed.

Project: `jkpfhqaxhsiwtijxxzql` (same one the app + pharmacy already use).
Secrets live in `supabase/.env.local` (gitignored — VAPID keys + cron key).

## Route A — access token (Claude runs everything via Management API / curl)

1. Linh: supabase.com → avatar → Access Tokens → Generate new token → paste
   into the Claude session.
2. Claude then, via `api.supabase.com` with `Authorization: Bearer <token>`:
   - `POST /v1/projects/{ref}/functions/deploy?slug=b33-push` with
     `functions/b33-push/index.ts` (multipart: metadata `{"verify_jwt":false,"entrypoint_path":"index.ts"}` + file) — deploys the function with JWT
     verification OFF (the `x-b33-key` header is the guard instead).
   - `POST /v1/projects/{ref}/secrets` with the four values from `.env.local`.
   - `POST /v1/projects/{ref}/database/query` with `setup.sql` (sent table +
     pg_cron/pg_net every-minute tick).
3. Verify: invoke the function once with the `x-b33-key` header → expect
   `{"ok":true,...}`; then a real end-to-end test (next section).

## Route B — dashboard (no token, click-by-click)

1. Dashboard → Edge Functions → Deploy new function → name `b33-push`,
   paste `functions/b33-push/index.ts`, and turn OFF "Verify JWT".
2. Edge Functions → b33-push → Secrets → add the four lines from `.env.local`.
3. SQL Editor → paste `setup.sql` → Run.

## End-to-end test (either route)

1. Phone: open Book33 → Notifications → banner must be green ("allowed");
   tap "Send a test notification" once (this also registers the push
   subscription — the footnote flips to "registered for cloud push").
2. Add an event ~3 minutes ahead with a 1-minute lead (or set a per-event
   Custom reminder), then CLOSE the app fully.
3. Within the lead minute the phone should ring with the reminder. If not:
   Edge Functions → b33-push → Logs (look at `sent/dead/skipped` counts).

## Notes

- Costs $0: ~43K invocations/month vs 500K free allowance; VAPID/FCM delivery
  is free; her existing daily sync keeps the free project from pausing.
- `web-push` via `npm:` needs the modern Deno-2 edge runtime (default in 2025+
  projects). If the function fails to boot on import, swap to
  `jsr:@negrel/webpush` — same VAPID keys, adjust the send call.
- Dead subscriptions (410) self-heal: the phone re-subscribes on next app open.
- Key rotation: regenerate VAPID pair, update `.env.local` + secrets + the
  `PUSH_PUBKEY` constant in index.html — clients detect the key change and
  re-subscribe automatically (`syncPushSubscription`).
