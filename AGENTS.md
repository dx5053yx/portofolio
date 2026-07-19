# AGENTS.md

Instruksi operasional buat AI coding agent yang ngerjain proyek ini. Spek lengkap ada di file lain dalam folder yang sama — file ini isinya cuma yang harus diketahui dari awal + hal-hal yang gampang salah kalau gak dikasih tau eksplisit.

> **Lokasi:** file ini dibuat pas proyek masih tahap planning. Begitu Next.js project di-scaffold, pindahin file ini (dan `CLAUDE.md`) ke root repo yang sebenarnya, bukan di dalam folder docs — itu lokasi standar yang di-scan semua coding agent.

## Baca dulu

- `README.md` — ringkasan & urutan implementasi
- `01-architecture.md` — struktur folder, alur data, env vars
- `02-database-schema.md` — SQL schema + RLS, jalankan ini duluan di Supabase
- `03-admin-panel.md` — spek form & routes admin
- `04-ai-integration.md` — kontrak API + prompt Gemini
- `desain.md` — token warna/font/layout, dipakai buat semua UI publik

## Stack & command

Next.js (App Router) + Supabase + Gemini API, deploy ke Vercel.

```bash
npm install
npm run dev      # dev server
npm run build    # production build — harus pass sebelum satu task dianggap selesai
npm run lint     # belum ada config lint spesifik, pakai default Next.js (eslint-config-next) kalau belum diganti
```

Belum ada test runner yang ditentuin. Kalau nambahin satu, update command-nya di sini juga.

## Aturan keras (jangan dilanggar)

- **Auth dua lapis, bukan satu.** Proteksi `/admin/*` harus ada di `middleware.ts` DAN di Row Level Security Supabase. Middleware doang gak cukup — API Supabase tetap bisa dipanggil langsung dari luar kalau RLS-nya kosong/salah.
- **`GEMINI_API_KEY` cuma boleh dipakai di server** (API route `/api/analyze-certificate`). Jangan pernah panggil Gemini langsung dari client component atau expose key-nya ke bundle browser.
- **Hasil AI itu draft, bukan auto-publish.** Field yang di-generate Gemini (title, issuer, date, description, category, tags) harus tetap jadi input yang bisa diedit user sebelum submit — jangan pernah langsung insert ke database tanpa lewat form.
- **Generate AI dipicu manual** (tombol), bukan otomatis pas file dipilih. Disengaja buat ngirit kuota gratis Gemini — jangan diubah jadi auto-trigger.
- **`category` cuma boleh 4 nilai:** `sertifikat`, `kompetisi`, `organisasi`, `proyek` — sesuai check constraint di tabel `achievements`. Jangan nambah nilai baru tanpa update schema-nya juga.
- **`status: 'draft'` gak boleh pernah nongol di halaman publik** — ini ditegakin di level RLS (`public_read_published` policy), bukan cuma disembunyiin di UI.

## Konvensi bahasa

- Konten yang keliatan user (label UI, pesan error, deskripsi achievement, copy tombol) → **Bahasa Indonesia**, kasual-profesional, sesuai tone di `desain.md`.
- Identifier kode (nama variabel, kolom database, route, field JSON) → **Inggris**, standar konvensi coding.

## Struktur (ringkas — detail di `01-architecture.md`)

```
app/            public routes + app/admin/ (protected) + app/api/ (route handlers)
lib/supabase/   client & server Supabase client
lib/gemini.ts   wrapper panggil Gemini API
middleware.ts   proteksi /admin/*
```

## Definition of done

Sebelum nganggep satu task kelar:

1. `npm run build` sukses tanpa error
2. Route `/admin/*` gak bisa diakses tanpa login (coba akses langsung tanpa session)
3. Kalau nyentuh schema, RLS policy-nya udah dicek ulang — bukan cuma migration-nya jalan
4. Achievement dengan `status: draft` gak muncul di halaman publik
