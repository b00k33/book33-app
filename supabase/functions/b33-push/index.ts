// Book33 — cloud push tick (2026-08-05).
// Runs every minute via pg_cron (see ../../setup.sql). Reads the book33 snapshot
// row(s) the app already syncs, and web-pushes any reminder that has come due.
// ALL reminder logic (leads, quiet hours, per-event overrides, fasting, commute)
// lives in the app — the daybook-push-queue key IS the decision, this function
// only delivers it. Dedup via the b33_push_sent table so a reminder fires once
// even though the cron re-reads the same queue every minute.
//
// Secrets required (supabase secrets set / dashboard → Edge Functions → Secrets):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:...), B33_CRON_KEY
// Deploy with --no-verify-jwt; the x-b33-key header (checked below) is the guard.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const GRACE_MS = 15 * 60 * 1000; // deliver up to 15 min late (missed ticks), never older

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.headers.get("x-b33-key") !== Deno.env.get("B33_CRON_KEY")) {
    return new Response("nope", { status: 401 });
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  webpush.setVapidDetails(
    Deno.env.get("VAPID_SUBJECT") ?? "mailto:linh.quach3@gmail.com",
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!,
  );

  const now = Date.now();
  let sent = 0, dead = 0, skipped = 0;

  const { data: rows, error } = await sb.from("book33").select("owner,data");
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  for (const row of rows ?? []) {
    // snapshot values are localStorage strings — parse the two we care about
    const snap = (row.data ?? {}) as Record<string, string>;
    let sub: unknown, queue: { reminders?: Array<Record<string, unknown>> } | null = null;
    try { sub = JSON.parse(snap["daybook-push-sub"] ?? "null"); } catch { sub = null; }
    try { queue = JSON.parse(snap["daybook-push-queue"] ?? "null"); } catch { queue = null; }
    if (!sub || typeof sub !== "object" || !("endpoint" in sub)) continue;
    if (!queue || !Array.isArray(queue.reminders)) continue;

    const due = queue.reminders.filter((r) =>
      typeof r.when === "number" && r.when <= now && r.when > now - GRACE_MS && typeof r.tag === "string"
    );

    for (const rem of due) {
      // first-writer-wins dedup: PK (owner, tag, fire_at) — a second tick's insert
      // conflicts and we skip. No read-then-write race across overlapping ticks.
      const { error: insErr } = await sb.from("b33_push_sent")
        .insert({ owner: row.owner, tag: rem.tag, fire_at: rem.when });
      if (insErr) { skipped++; continue; }

      try {
        await webpush.sendNotification(
          sub as webpush.PushSubscription,
          JSON.stringify({ title: rem.title, body: rem.body, tag: rem.tag, data: rem.data }),
          { TTL: 3600 },
        );
        sent++;
      } catch (e) {
        // 404/410 = subscription expired/revoked — the phone re-subscribes on its
        // next app open (syncPushSubscription), so just count it and move on.
        dead++;
        console.error("push failed", (e as { statusCode?: number }).statusCode ?? e);
      }
    }
  }

  // light housekeeping once an hour: sent markers older than 3 days are useless
  if (new Date().getUTCMinutes() === 0) {
    await sb.from("b33_push_sent").delete().lt("fire_at", now - 3 * 86400_000);
  }

  return Response.json({ ok: true, sent, dead, skipped });
});
