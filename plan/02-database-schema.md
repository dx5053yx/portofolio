# Database Schema (Supabase / Postgres)

## Tabel `achievements`

```sql
create table achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('sertifikat', 'kompetisi', 'organisasi', 'proyek')),
  issuer text,
  date_achieved date,
  description text,
  file_url text,
  verify_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index achievements_status_idx on achievements (status);
create index achievements_category_idx on achievements (category);
```

Trigger auto-update `updated_at` (opsional tapi enak buat sorting "baru diubah"):

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger achievements_updated_at
  before update on achievements
  for each row execute function set_updated_at();
```

## Row Level Security

```sql
alter table achievements enable row level security;

-- publik cuma boleh baca yang published
create policy "public_read_published"
  on achievements for select
  using (status = 'published');

-- admin (satu akun) boleh semua operasi
create policy "admin_full_access"
  on achievements for all
  using (auth.uid() = '<ADMIN_USER_ID>'::uuid)
  with check (auth.uid() = '<ADMIN_USER_ID>'::uuid);
```

Ganti `<ADMIN_USER_ID>` dengan UUID akun admin (didapat setelah bikin user pertama di Supabase Auth).

## Storage bucket `certificates`

```sql
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true);

create policy "public_read_certificates"
  on storage.objects for select
  using (bucket_id = 'certificates');

create policy "admin_write_certificates"
  on storage.objects for insert
  with check (bucket_id = 'certificates' and auth.uid() = '<ADMIN_USER_ID>'::uuid);

create policy "admin_update_certificates"
  on storage.objects for update
  using (bucket_id = 'certificates' and auth.uid() = '<ADMIN_USER_ID>'::uuid);

create policy "admin_delete_certificates"
  on storage.objects for delete
  using (bucket_id = 'certificates' and auth.uid() = '<ADMIN_USER_ID>'::uuid);
```

Bucket-nya public read karena isinya emang buat dipajang di portfolio publik (bukan data sensitif).

## Kenapa `date_achieved`, bukan `date`

`date` valid dipakai jadi nama kolom di Postgres, tapi gampang ambigu sama nama tipe data `date` itu sendiri — dipisah biar jelas pas dibaca ulang atau di-query dari kode.
