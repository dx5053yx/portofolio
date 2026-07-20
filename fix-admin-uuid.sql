-- Fix ADMIN_USER_ID di semua RLS policy
-- UUID yang benar: bb3371c2-48e4-4179-9570-c7665b565f45

-- 1. Drop policy lama (yang pakai UUID salah)
drop policy if exists "admin_full_access" on achievements;
drop policy if exists "admin_write_certificates" on storage.objects;
drop policy if exists "admin_update_certificates" on storage.objects;
drop policy if exists "admin_delete_certificates" on storage.objects;

-- 2. Buat ulang dengan UUID yang benar
create policy "admin_full_access"
  on achievements for all
  using (auth.uid() = 'bb3371c2-48e4-4179-9570-c7665b565f45'::uuid)
  with check (auth.uid() = 'bb3371c2-48e4-4179-9570-c7665b565f45'::uuid);

create policy "admin_write_certificates"
  on storage.objects for insert
  with check (bucket_id = 'certificates' and auth.uid() = 'bb3371c2-48e4-4179-9570-c7665b565f45'::uuid);

create policy "admin_update_certificates"
  on storage.objects for update
  using (bucket_id = 'certificates' and auth.uid() = 'bb3371c2-48e4-4179-9570-c7665b565f45'::uuid);

create policy "admin_delete_certificates"
  on storage.objects for delete
  using (bucket_id = 'certificates' and auth.uid() = 'bb3371c2-48e4-4179-9570-c7665b565f45'::uuid);
