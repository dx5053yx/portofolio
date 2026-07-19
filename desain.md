# Arah Desain — Portfolio Akiru

## Konsep: "Build Log"

Kebanyakan portfolio developer punya dua rak terpisah: rak proyek (kartu-kartu mengkilap) dan rak penghargaan (badge/piala berjejer). Portfolio ini nolak pemisahan itu. Semuanya — proyek yang di-ship, sertifikat yang didapat, kompetisi yang diikutin — diperlakukan sebagai **entri di satu log yang sama**, kayak commit history atau changelog dari sistem yang terus dibangun. Ini juga lebih jujur sama gimana Akiru sebenernya kerja: solo builder yang ngerjain proyek beruntun (NihonZ, siPandu, dst), bukan orang yang ngumpulin trofi buat dipajang di lemari kaca.

Dark background di sini dipilih karena masuk akal buat konsep log/terminal ini — bukan default "portfolio developer ya pasti dark mode" yang dipilih asal.

## Warna

| Token | Hex | Peran |
|---|---|---|
| `--bg` | `#12141A` | Background utama — graphite gelap, bukan hitam pekat |
| `--panel` | `#1B1E27` | Background card/panel, sedikit lebih terang dari bg |
| `--text` | `#E4E6EB` | Teks utama — off-white, bukan putih murni |
| `--text-muted` | `#8B8FA3` | Teks sekunder/metadata (timestamp, label) |
| `--accent-teal` | `#38BDAE` | Status "shipped/published", link, elemen interaktif |
| `--accent-amber` | `#E8A65C` | Status "in-progress/featured" — dipakai NGIRIT, cuma buat penanda status |

Teal dipilih bukan sekadar "warna hacker" template — nyambung ke swimming (salah satu hal yang Akiru suka) sekaligus tetep kebaca presisi/teknis tanpa jatuh ke klise neon-hijau. Amber dipasangin biar sistem warnanya **fungsional**: teal = selesai/stabil, amber = masih jalan/lagi disorot — bukan dekorasi doang, tapi encode status beneran.

Jangan nambah warna lain di luar 6 token ini, kecuali state error/success standar (boleh pinjam merah/hijau semantic netral, gak perlu didesain khusus).

## Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display/headline | **Space Grotesk** | Karakter geometris-teknis, beda dari Inter/Helvetica yang dipakai di mana-mana |
| Body | **IBM Plex Sans** | Kualitas baca tinggi, nuansa teknis tapi tetap hangat, gak generik |
| Mono/data | **IBM Plex Mono** | Timestamp, tag stack, label kategori — satu keluarga sama Plex Sans jadi tetap nyambung |

Space Grotesk cuma dipakai di headline besar (nama, judul section) — jangan dipakai buat body text, biar gak "ribut". Mono cuma buat elemen data/metadata, jangan buat paragraf panjang.

Semua tiga font tersedia gratis di Google Fonts.

Skala ukuran (contoh, boleh disesuaikan pas implementasi):

- Headline besar: 48–64px, Space Grotesk SemiBold/Bold
- Section title: 24–28px, Space Grotesk Medium
- Body: 16–18px, IBM Plex Sans Regular
- Metadata/mono: 13–14px, IBM Plex Mono Regular, letter-spacing sedikit dilebarin

## Layout

Struktur halaman utama (long-scroll, satu halaman):

```
+------------------------------------------+
| [mono] status: building - sejak 2024      |
|                                            |
|  AKIRU                    (Space Grotesk) |
|  Informatics - Solo builder                |
+------------------------------------------+

+------------------------------------------+
| PROJECTS                                  |
| o 2026.03  shipped     NihonZ             |
|   [mono] React - Firebase - Zustand       |
|   Aplikasi belajar JLPT N4 dengan          |
|   mekanik RPG                             |
|                                            |
| o 2025.09  shipped     siPandu            |
|   [mono] Next.js - Supabase - Gemini      |
|   Chatbot WhatsApp + dashboard UMKM       |
+------------------------------------------+

+------------------------------------------+
| ACHIEVEMENTS              [filter: tag]   |
| o 2026.05  sertifikat   Dicoding React    |
| * 2026.02  kompetisi    Juara 1 CTF ...   |
+------------------------------------------+

+------------------------------------------+
| ABOUT - CONTACT                           |
| (singkat: bio pendek, email, GitHub)      |
+------------------------------------------+
```

Hero **bukan** "Hi, I'm Akiru" gede di tengah dengan gradient — dibuka pakai status line ala terminal/systemd (`status: building · sejak 2024`), baru nama. Lebih jujur ke konsep "log yang masih jalan" ketimbang headline marketing.

Border-radius: kecil (6–8px) buat card konten (biar kebaca "terstruktur" tapi gak kaku), nyaris tajam (2–3px) buat tag/badge mono (biar kerasa "presisi/data", beda tekstur sama card).

## Signature element: kartu "log entry"

Satu komponen yang dipakai konsisten buat project MAUPUN achievement — ini yang bikin halaman keinget:

```
o 2026.03  shipped                    <- mono, --text-muted
NihonZ                                <- Space Grotesk, --text
React - Firebase - Zustand            <- mono, --text-muted, kecil
Aplikasi belajar JLPT N4 dengan        <- Plex Sans, --text
mekanik RPG (heart, combo, boss).
```

Titik status di kiri (●/○/★) fungsinya beneran encode status, bukan bullet dekoratif: terisi = shipped/published, kosong = draft (cuma keliatan di admin, gak pernah tampil ke publik), bintang = featured.

## Motion

Minim, terarah:

- Entri log fade + geser dikit ke atas pas scroll masuk viewport (stagger tipis antar entri, ngasih kesan "log lagi di-stream")
- Titik status pada entri berstatus "in-progress" boleh pulse sangat halus (cuma buat entri itu, jangan yang lain)
- **Hindari:** gradient blob animasi, parallax berat, efek hover yang norak. Hormati `prefers-reduced-motion`.

## Voice & microcopy

- Kalimat aktif, to the point. Tombol bilang persis apa yang terjadi: "Simpan", bukan "Submit". Aksi "Terbitkan" menghasilkan toast "Berhasil diterbitkan" — nama aksi konsisten dari tombol sampai konfirmasi.
- Status pakai istilah yang recognizable: `shipped`, `building`, `archived` — bukan jargon internal.
- Error jangan minta maaf, jelasin apa yang salah + apa yang bisa dilakuin. Contoh: "Gagal baca sertifikat. Coba upload ulang atau isi manual." — bukan "Terjadi kesalahan, silakan coba lagi nanti."
- Empty state adalah ajakan bertindak, bukan cuma info kosong. Contoh (dashboard admin belum ada entry): "Belum ada entri. Upload sertifikat pertama." — bukan "Tidak ada data."

## Panel admin: gak perlu treatment penuh

Panel admin (`/admin/*`) pakai token warna & font yang sama biar tetap nyambung, tapi layoutnya utilitarian — form standar, tabel list, gak perlu efek/animasi khusus. Ini ruang kerja privat buat Akiru doang; effort desain lebih layak dituangin ke halaman publik yang bakal diliat orang lain.

## Token CSS (siap pakai)

```css
:root {
  --bg: #12141A;
  --panel: #1B1E27;
  --text: #E4E6EB;
  --text-muted: #8B8FA3;
  --accent-teal: #38BDAE;
  --accent-amber: #E8A65C;

  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --radius-card: 8px;
  --radius-tag: 3px;
}
```
