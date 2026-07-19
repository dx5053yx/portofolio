# Panel Admin

## Routes

| Route | Fungsi |
|---|---|
| `/admin/login` | Form login (email/password atau magic link) |
| `/admin` | Dashboard — list semua achievement (termasuk draft), tombol edit/hapus, toggle featured |
| `/admin/new` | Form tambah achievement baru |
| `/admin/edit/[id]` | Form edit achievement yang udah ada |

Semua route di atas kecuali `/admin/login` diproteksi lewat `middleware.ts` (lihat `01-architecture.md`).

## Form fields

| Field | Tipe input | Wajib? | Catatan |
|---|---|---|---|
| File sertifikat | file upload (image/pdf) | ya | trigger AI generate setelah dipilih |
| Judul | text | ya | di-prefill AI, bisa diedit |
| Kategori | select (sertifikat/kompetisi/organisasi/proyek) | ya | di-prefill AI (`suggested_category`), bisa diganti |
| Penerbit/issuer | text | tidak | di-prefill AI |
| Tanggal | date picker | tidak | di-prefill AI — AI bisa gagal baca, biarin kosong aja, jangan maksa |
| Deskripsi | textarea | ya | di-prefill AI, WAJIB direview manual sebelum save |
| Link verifikasi | url | tidak | opsional, kalau sertifikatnya punya link verify online |
| Tags | multi-input/chips | tidak | di-prefill AI (`suggested_tags`), bisa nambah/hapus |
| Featured | toggle | - | default off |
| Status | select (draft/published) | ya | default draft, biar gak langsung tayang sebelum siap |

## Alur upload + AI generate

1. Akiru pilih file di form
2. Preview file muncul (thumbnail gambar, atau nama file kalau PDF)
3. Tombol **"Generate dengan AI"** — manual trigger, bukan otomatis begitu file dipilih (biar Akiru bisa cek dulu filenya bener sebelum manggil API, sekalian ngirit kuota)
4. Loading state jelas ("Membaca sertifikat...")
5. Kalau berhasil, semua field ke-prefill, ada badge kecil "diisi AI, cek lagi ya" di field yang di-generate
6. Kalau gagal (network error, Gemini down, rate limit) — toast error yang jelas ("Gagal generate, isi manual dulu ya", bukan pesan error teknis mentah), form tetap bisa diisi manual, gak nge-block alur
7. Akiru submit, file ke-upload ke Storage dulu, baru insert row ke `achievements` pakai URL file-nya

## Kenapa generate-nya manual, bukan auto saat upload

Biar Akiru yang kontrol kapan API kepanggil (ngirit kuota harian Gemini yang gratis), dan biar ada jeda buat mastiin file yang keupload udah bener sebelum diproses AI.
