-- Where each student's profile picture lives (a public web address)
alter table public.profiles add column avatar_url text;

-- A storage bucket for profile pictures; public = anyone can view the images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Anyone can view avatars
create policy "Avatars are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- You can only upload into your own folder: avatars/<your user id>/...
create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- You can only replace files in your own folder
create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- You can only look up files in your own folder (needed to replace your photo).
-- Viewing photos doesn't need this: the bucket is public, so its URLs work for everyone.
create policy "Users can read their own avatar files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);