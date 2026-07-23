# Fixes — Round 1 (dari code review 21 Jul 2026)

Temuan dari review `github.com/dx5053yx/portofolio`. Dikelompokkan per prioritas — kerjain dari atas ke bawah.

**Status: semua item wajib udah diverifikasi kelar** (dicek ulang 23 Jul 2026 — clone fresh, `npm install`, `tsc --noEmit`, `eslint`, coba build).

## Prioritas 1 — Fitur AI belum bisa jalan sama sekali

- [x] `lib/gemini.ts` — model diganti ke `gemini-2.5-flash`. Sekalian ditambahin timeout 25 detik + error handling terpisah (timeout/kuota habis/gagal umum).

## Prioritas 2 — Bersihin repo

- [x] `fix-admin-uuid.sql` — udah dihapus, gak ada lagi di `git ls-files`.
- [x] `create_admin.js` — udah dihapus.

## Prioritas 3 — `npm run lint` harus clean

- [x] `components/ScrollAnimator.tsx` — dibenerin pakai lazy initializer, sesuai saran.

## Prioritas 4 — Konsistensi auth

- [x] `app/api/analyze-certificate/route.ts` — sekarang cek `user.id !== ADMIN_USER_ID`, samain kayak `proxy.ts`.

## Nice-to-have — status

- [x] Unused vars — bersih, gak muncul lagi di lint.
- [x] 2x `any` di `AchievementForm.tsx` — udah dikasih tipe yang bener.
- [x] Font dobel-load — `@import` di `globals.css` udah dicabut, tinggal `next/font` doang.
- [x] Timeout Gemini — udah ditambahin (lihat Prioritas 1).
- [ ] `<img>` → `next/image` di `LogEntry.tsx` — belum diambil, masih `<img>` dengan lint di-suppress manual. Tetep opsional, gak mendesak.

---

# Fixes — Round 2 (dari code review 23 Jul 2026)

Muncul dari komit baru `fix:add-tumnail` (nambahin `PdfThumbnail.tsx` buat preview sertifikat PDF pakai `pdfjs-dist`) — fitur bagusnya jalan, cuma nyisain 1 lint error.

## Prioritas 1 — satu-satunya blocker

- [ ] `components/PdfThumbnail.tsx` baris 18 — `let renderTask: any;` gagal lint (`@typescript-eslint/no-explicit-any`). Ganti jadi tipe yang diturunin dari return value-nya sendiri, biar gak perlu tau nama tipe import pdfjs-dist yang persis:

  ```ts
  let renderTask: ReturnType<typeof page.render> | undefined;
  ```

## Verifikasi setelah selesai

1. `npm run lint` — harus 0 error
2. `npm run build` — harus sukses (kalau dites lokal; kalau di sandbox tanpa akses fonts.googleapis.com, error font itu bukan bug kode, aman diabaikan)
3. Upload sertifikat gambar DAN sertifikat PDF, klik "Generate dengan AI" di dua-duanya — mastiin thumbnail PDF beneran render, bukan cuma AI generate-nya yang jalan
4. `git ls-files` — pastiin `fix-admin-uuid.sql` dan `create_admin.js` tetap gak ada