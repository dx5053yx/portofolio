# Arsitektur

## Overview

Dua "wajah" dalam satu Next.js app:

- **Publik** — halaman portfolio, SSG/ISR, baca data dari Supabase (read-only, hanya yang `status = 'published'`)
- **Admin** (`/admin/*`) — dilindungi auth, cuma Akiru yang bisa masuk, CRUD achievement + trigger AI suggestion

## Alur data

**Publik:**

```
Visitor -> Next.js page (SSG/ISR) -> Supabase (SELECT, RLS: status='published') -> render
```

**Admin — nambah achievement baru:**

```
Akiru -> login /admin/login (Supabase Auth)
      -> /admin (dashboard)
      -> /admin/new
      -> upload gambar/PDF sertifikat
      -> klik "Generate dengan AI"
      -> POST /api/analyze-certificate (Next.js API route)
      -> API route kirim gambar ke Gemini API
      -> Gemini balikin JSON: title, issuer, date, description, suggested_category, suggested_tags
      -> form ke-prefill otomatis
      -> Akiru review/edit field yang perlu
      -> submit -> upload file ke Supabase Storage + insert row ke tabel achievements
      -> nongol di halaman publik (setelah revalidate atau langsung kalau pakai on-demand ISR)
```

## Struktur folder (Next.js App Router)

```
app/
  page.tsx                       # halaman utama (hero, about, projects, achievements preview)
  achievements/page.tsx          # daftar lengkap achievement (opsional, atau cukup section di homepage)
  admin/
    login/page.tsx
    page.tsx                     # dashboard: list achievement + tombol edit/delete
    new/page.tsx
    edit/[id]/page.tsx
  api/
    analyze-certificate/route.ts # panggil Gemini
    health/route.ts              # dipakai buat keep-alive Supabase, lihat di bawah
lib/
  supabase/
    client.ts                    # browser client
    server.ts                    # server client (server components & route handlers)
  gemini.ts                      # wrapper manggil Gemini API
middleware.ts                    # proteksi /admin/*
```

## Auth & proteksi admin

- Supabase Auth, satu akun aja (email/password atau magic link, bebas pilih salah satu)
- `middleware.ts` cek session di setiap request ke `/admin/*`, redirect ke `/admin/login` kalau gak ada session ATAU `session.user.id !== ADMIN_USER_ID`
- **Penting:** proteksi harus dua lapis — middleware (buat UX, biar gak nyasar ke halaman admin) DAN Row Level Security di Supabase (buat keamanan beneran). Jangan andelin middleware doang, karena API Supabase tetap bisa diakses langsung kalau RLS-nya gak diset (lihat `02-database-schema.md`).

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-side only
GEMINI_API_KEY=                  # server-side only, dipanggil dari API route, jangan pernah expose ke client
ADMIN_USER_ID=                   # UUID akun admin di Supabase Auth, buat dicocokin di middleware & RLS
```

## Biaya (semua ditarget free tier)

| Layanan | Free tier | Catatan |
|---|---|---|
| Supabase | 500MB database, 1GB storage, 50K MAU | Project di-pause otomatis kalau gak ada query nyata ke database selama 7 hari — perlu scheduled ping (lihat di bawah) |
| Vercel | 100GB bandwidth, jutaan function invocation/bulan | Hobby plan, gratis tapi khusus non-commercial — aman buat portfolio personal |
| Gemini API | Model Flash/Flash-Lite, kuota harian ratusan-ribuan request | Gratis tanpa batas waktu, gak perlu kartu kredit — tapi cek limit aktif di AI Studio pas mulai implementasi, karena kuotanya sering direvisi Google |

### Keep-alive Supabase

Bikin GitHub Actions workflow yang jalan tiap hari, hit endpoint `/api/health` (yang di dalemnya ada satu query ringan ke Supabase) biar project gak pernah kena pause 7-hari-tanpa-aktivitas:

```yaml
# .github/workflows/keep-alive.yml
name: Keep Supabase Alive
on:
  schedule:
    - cron: '0 0 * * *'   # tiap hari jam 00:00 UTC
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl -sf https://<domain-portfolio>/api/health
```
