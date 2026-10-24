-- Book33 "My quotes": the shared cloud picture cupboard -- one-time Supabase setup (2026-10-15).
-- Run this once in Book33's Supabase project (mqaswzpuqqlujfhooplm):
--   Dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- Safe to run again (every step is "if not exists" / "drop if exists").
-- RUN 2026-10-24 on Linh's explicit yes (her rule: shown to her first, run only on her yes).
--
-- Why this exists: the quote library keeps each quote's words and a tiny round picture inside the
-- app's notebook (the one synced row), but the big picture (1200 px, about 150 KB) cannot live there
-- (the notebook has a ~5 MB cap). The app uploads it to a private storage bucket called quote-pics.
-- Until this file has been run, the app still works: new pictures wait on the device they were made on
-- ("Waiting to upload" on the tile) and go up on their own once the bucket exists.
--
-- What this creates:
--   1. The private bucket quote-pics (JPEG only, 5 MB per file).
--   2. Row Level Security on its objects so a signed-in login can only see, add, replace and remove
--      files inside its OWN folder (<user id>/<quote id>.jpg). Nobody else's login can read them, and
--      the bucket is not public, so a picture has no web address that works without her sign-in.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quote-pics', 'quote-pics', false, 5242880, array['image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "quote-pics: read own folder" on storage.objects;
create policy "quote-pics: read own folder"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'quote-pics' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "quote-pics: add to own folder" on storage.objects;
create policy "quote-pics: add to own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'quote-pics' and (storage.foldername(name))[1] = auth.uid()::text);

-- replacing a picture re-uploads the same path (upsert), which needs UPDATE as well as INSERT
drop policy if exists "quote-pics: replace in own folder" on storage.objects;
create policy "quote-pics: replace in own folder"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'quote-pics' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'quote-pics' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "quote-pics: remove from own folder" on storage.objects;
create policy "quote-pics: remove from own folder"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'quote-pics' and (storage.foldername(name))[1] = auth.uid()::text);

-- Check (optional): the bucket row and four policies should come back.
-- select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'quote-pics';
-- select policyname from pg_policies where tablename = 'objects' and policyname like 'quote-pics:%';
