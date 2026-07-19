# Backlog Fitur

## Fase 1 — MVP (harus ada)

- [ ] CRUD achievement lewat panel admin
- [ ] Auth admin (satu akun)
- [ ] Upload file ke Storage
- [ ] Generate draft via Gemini API
- [ ] Halaman publik nampilin achievement yang `published`
- [ ] Deploy ke Vercel + Supabase, keep-alive setup

## Fase 2 — pengalaman admin lebih enak

- [ ] Toggle `featured` + urutan manual (`sort_order`) buat pin achievement favorit
- [ ] Filter/search di dashboard admin (banyak entry bakal susah di-scroll)
- [ ] Filter tag/kategori di halaman publik

## Fase 3 — nice to have

- [ ] Kompres gambar sebelum upload (misal pakai browser-image-compression) — ngirit storage 1GB gratis Supabase
- [ ] Open Graph meta tags per halaman, biar link preview bagus pas di-share
- [ ] Generate CV/PDF otomatis dari data achievement + projects yang sama (satu sumber data, dua output)
- [ ] i18n (ID/EN toggle) kalau portfolio-nya mau ditarget buat recruiter luar juga

## Di luar scope (sengaja gak dikerjain dulu)

- Multi-user/multi-admin
- Komentar/interaksi publik
- Analytics custom (kalau perlu, tinggal pasang Vercel Analytics, gak perlu dibangun sendiri)
