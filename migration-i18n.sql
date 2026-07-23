-- ============================================================
-- Portfolio Akiru — Database Migration (Fase 3: i18n)
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- Tambahkan kolom bahasa Inggris ke tabel achievements
ALTER TABLE achievements
ADD COLUMN title_en text,
ADD COLUMN description_en text,
ADD COLUMN issuer_en text;
