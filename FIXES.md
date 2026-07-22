# Fixes — Round 1 (dari code review 21 Jul 2026)

Temuan dari review `github.com/dx5053yx/portofolio`. Dikelompokkan per prioritas — kerjain dari atas ke bawah.

## Prioritas 1 — Fitur AI belum bisa jalan sama sekali

- [ ] `lib/gemini.ts` — ganti `model: 'gemini-3.0-flash'` jadi `model: 'gemini-2.5-flash'`. Model ID `gemini-3.0-flash` gak valid (format nama model Google gak punya bentuk "3.0"), setiap panggilan bakal gagal. `gemini-2.5-flash` udah dikonfirmasi stabil dan jadi contoh resmi di dokumentasi `@google/genai` saat ini.

## Prioritas 2 — Bersihin repo

- [ ] Hapus `fix-admin-uuid.sql`. Fix-nya udah keaplikasiin ke Supabase asli — file ini cuma sisa histori yang nge-expose UUID admin asli ke repo publik tanpa perlu lagi.
- [ ] Hapus `create_admin.js`. Ini bukan script "bikin admin" — isinya scaffold generator buat nulis file-file proyek yang ketinggalan kehapus. Hardcode path lokal (`/home/akiru/Documents/porto`) dan gagal lint sendiri (pakai `require()`).

## Prioritas 3 — `npm run lint` harus clean (sekarang masih ada error, bukan cuma warning)

- [ ] `components/ScrollAnimator.tsx` — error `react-hooks/set-state-in-effect` di bagian yang manggil `setIsVisible(true)` langsung di dalam effect (buat cek `prefers-reduced-motion`). Fix: inisialisasi `isVisible` pakai lazy initializer (`useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)`) buat cabang reduced-motion, biar gak ada setState di dalam effect. Logic-nya sendiri udah bener, ini soal pattern doang.

## Prioritas 4 — Konsistensi auth

- [ ] `app/api/analyze-certificate/route.ts` — auth check sekarang cuma `if (!session)`. Tambahin cek `session.user.id === process.env.ADMIN_USER_ID`, samain kayak yang udah ada di `proxy.ts`. Endpoint ini motong kuota gratis Gemini kalau kepanggil bukan dari admin.

## Nice-to-have (opsional, gak blocking)

- [ ] Unused vars di beberapa file: `AdminTableClient.tsx`, `admin/actions.ts`, `admin/login/page.tsx`, `admin/new/page.tsx`, `admin/page.tsx`, `api/health/route.ts`
- [ ] 2x pemakaian `any` di `AchievementForm.tsx` — kasih tipe yang bener
- [ ] `<img>` → `next/image` minimal di `LogEntry.tsx` (ini yang publik, ngaruh ke performa halaman)
- [ ] Font ke-load dobel: `next/font/google` di `layout.tsx` DAN `@import` di `globals.css` — pilih satu aja (next/font, lebih optimal)
- [ ] Tambahin timeout eksplisit (20-30 detik) buat call Gemini di `lib/gemini.ts`, sesuai spec awal di `plan/04-ai-integration.md`

## Verifikasi setelah selesai

1. `npm run lint` — harus 0 error
2. `npm run build` — harus sukses
3. Upload sertifikat asli, klik "Generate dengan AI" — harus balikin hasil, bukan error model
4. `git ls-files` — pastiin `fix-admin-uuid.sql` dan `create_admin.js` udah gak ada di tracking
