# Portfolio Akiru — Planning Docs

Dokumen perencanaan untuk website portfolio pribadi Akiru (mahasiswa Informatika Unsoed). Folder ini dibuat supaya bisa langsung di-handoff ke agent lain (Claude Code, Cursor, dsb) buat mulai implementasi tanpa perlu tanya-tanya ulang.

## Ringkasan proyek

Website portfolio publik yang menampilkan profil, proyek, dan jejak prestasi (sertifikat, kompetisi, organisasi) milik Akiru. Ada panel admin privat (cuma bisa diakses Akiru) buat nambah/edit konten tanpa perlu deploy ulang atau nulis kode. Fitur pembeda utama: saat upload sertifikat/piagam di panel admin, AI (Gemini API) otomatis baca gambarnya dan bikin draft judul + deskripsi + kategori, tinggal di-review dan disimpan.

## Stack

- **Next.js** (App Router) — frontend + API routes
- **Supabase** — Postgres (data), Auth (login admin), Storage (file sertifikat)
- **Gemini API** (Google AI Studio) — vision model buat generate draft dari gambar sertifikat
- **Vercel** — hosting/deploy

Semua ditarget free tier — detail & catatan biayanya ada di `01-architecture.md`.

## Scope

Yang dibahas detail di dokumen-dokumen ini: **halaman achievement/jejak prestasi + panel admin CRUD + integrasi AI**, karena ini bagian paling kompleks dan paling butuh spesifikasi jelas.

Bagian lain dari portfolio (about/bio, daftar proyek, kontak) cukup sederhana — bisa hardcoded/config-driven dulu di awal, gak perlu CMS penuh. Bisa dikembangin pakai pola admin yang sama nanti kalau memang dibutuhin.

## Isi folder ini

| File | Isinya |
|---|---|
| `01-architecture.md` | Arsitektur teknis, alur data, struktur folder/route, environment variables, estimasi biaya |
| `02-database-schema.md` | Skema tabel Supabase (SQL), Row Level Security, storage bucket |
| `03-admin-panel.md` | Spesifikasi panel admin: routes, form fields, alur upload + AI |
| `04-ai-integration.md` | Detail integrasi Gemini API: prompt, kontrak request/response, error handling |
| `05-features-backlog.md` | Fitur tambahan, dibagi per fase (MVP → nice-to-have) |
| `desain.md` | Arah visual/UI: konsep, warna, tipografi, layout, komponen, voice |

## Urutan implementasi yang disaranin

1. Setup Supabase project + jalankan schema di `02-database-schema.md`
2. Setup Next.js project, konek ke Supabase
3. Bangun panel admin — CRUD dasar dulu, tanpa AI (`03-admin-panel.md`)
4. Tambahin integrasi AI di alur upload (`04-ai-integration.md`)
5. Bangun halaman publik pakai arah desain di `desain.md`
6. Deploy ke Vercel, setup keep-alive buat Supabase (lihat `01-architecture.md`)
