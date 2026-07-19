# Integrasi AI (Gemini API)

## Model

Pakai model Gemini Flash atau Flash-Lite yang paling baru dan masih di free tier — cek langsung di [Google AI Studio](https://aistudio.google.com) pas mulai implementasi, karena nama & kuotanya sering direvisi Google, jangan hardcode asumsi dari dokumen ini. Yang penting: harus vision-capable (bisa nerima input gambar langsung).

## Endpoint internal

```
POST /api/analyze-certificate
```

**Request** — multipart/form-data:

```
file: <binary gambar atau PDF>
```

**Response sukses (200):**

```json
{
  "title": "Sertifikat Belajar React - Dicoding",
  "issuer": "Dicoding Indonesia",
  "date": "2026-03-15",
  "description": "Menyelesaikan kelas Belajar Membuat Front-End Web untuk Pemula, mencakup dasar React dan pengelolaan state.",
  "suggested_category": "sertifikat",
  "suggested_tags": ["react", "frontend", "dicoding"]
}
```

**Response gagal (4xx/5xx):**

```json
{ "error": "pesan error yang aman ditampilkan ke user" }
```

## Prompt ke Gemini

```
Kamu membantu mengekstrak informasi dari gambar sertifikat/piagam untuk ditampilkan di portfolio online.

Dari gambar yang diberikan, hasilkan HANYA JSON dengan format ini (tanpa markdown code fence, tanpa teks lain di luar JSON):

{
  "title": string,
  "issuer": string atau null,
  "date": string (format YYYY-MM-DD) atau null,
  "description": string (2-3 kalimat, Bahasa Indonesia, nada profesional, cocok buat ditampilkan di portfolio),
  "suggested_category": salah satu dari "sertifikat" | "kompetisi" | "organisasi" | "proyek",
  "suggested_tags": array of string (maksimal 5, lowercase, tanpa spasi berlebih)
}

Aturan:
- Kalau ada info yang gak kebaca jelas dari gambar, isi null. JANGAN mengarang/menebak informasi yang gak ada di gambar.
- description harus berdasar isi sertifikat aja, jangan nambahin klaim yang gak ada di gambar.
```

## Implementasi API route (garis besar)

1. Terima file dari form (multipart)
2. Convert ke base64
3. Kirim ke Gemini API (model vision) dengan prompt di atas + gambar
4. Parse response — strip pembungkus code fence dulu kalau modelnya masih ngebungkus output pakai fence (kadang tetap kejadian walau udah diminta enggak), baru `JSON.parse`
5. Validasi hasil parse sesuai shape yang diharapkan (title minimal ada, category salah satu dari 4 pilihan) — kalau gagal validasi, balikin error yang jelas, jangan kirim data setengah-jadi ke form
6. Return JSON ke client

## Hal yang perlu dijaga

- **API key Gemini cuma ada di server** (environment variable `GEMINI_API_KEY`), gak pernah dikirim/exposed ke client. Semua panggilan lewat API route Next.js, bukan langsung dari browser.
- **Timeout & error handling** — kasih timeout wajar (misal 20-30 detik), soalnya vision model bisa agak lama. Kalau timeout/error, form tetap harus bisa diisi manual (lihat `03-admin-panel.md`).
- **Rate limit** — dengan volume upload personal (kemungkinan cuma beberapa kali per bulan), kuota gratis Gemini jauh lebih dari cukup. Gak perlu bikin rate-limiting tambahan di endpoint sendiri.
- **Privasi** — di free tier, input yang dikirim ke Gemini bisa dipakai Google buat improve model mereka. Karena sertifikat ini emang bakal dipajang publik di portfolio, risikonya rendah, tapi worth diketahui Akiru.
- **AI = draft, bukan final** — jangan pernah auto-publish hasil AI tanpa direview. Field yang di-generate AI harus tetap editable di form sebelum submit (lihat `03-admin-panel.md`).
