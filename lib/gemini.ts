import { GoogleGenAI } from '@google/genai';
import type { AiAnalysisResult, Category } from '@/lib/types';

const VALID_CATEGORIES: Category[] = ['sertifikat', 'kompetisi', 'organisasi', 'proyek'];

const PROMPT = `Kamu membantu mengekstrak informasi dari gambar sertifikat/piagam untuk ditampilkan di portfolio online.

Dari gambar yang diberikan, hasilkan HANYA JSON dengan format ini (tanpa markdown code fence, tanpa teks lain di luar JSON):

{
  "title": string,
  "title_en": string (terjemahan bahasa Inggris dari title),
  "issuer": string atau null,
  "issuer_en": string atau null (terjemahan bahasa Inggris dari issuer),
  "date": string (format YYYY-MM-DD) atau null,
  "description": string (2-3 kalimat, Bahasa Indonesia, nada profesional, cocok buat ditampilkan di portfolio),
  "description_en": string (terjemahan bahasa Inggris dari description, dengan nada profesional),
  "suggested_category": salah satu dari "sertifikat" | "kompetisi" | "organisasi" | "proyek",
  "suggested_tags": array of string (maksimal 5, lowercase, tanpa spasi berlebih)
}

Aturan:
- Kalau ada info yang gak kebaca jelas dari gambar, isi null. JANGAN mengarang/menebak informasi yang gak ada di gambar.
- description harus berdasar isi sertifikat aja, jangan nambahin klaim yang gak ada di gambar.`;

/**
 * Analyze a certificate image using Gemini Vision API.
 * This function should ONLY be called server-side (API route).
 */
export async function analyzeCertificate(
  imageBase64: string,
  mimeType: string
): Promise<AiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum diset di environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const TIMEOUT_MS = 25000;
  let response;
  try {
    const apiCall = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)
    );

    response = await Promise.race([apiCall, timeoutPromise]);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage === 'TIMEOUT') {
      throw new Error('Proses AI membutuhkan waktu terlalu lama (timeout 25 detik). Silakan isi manual.');
    }
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
      throw new Error('Kuota Gemini API habis. Coba lagi dalam beberapa menit, atau isi form manual.');
    }
    throw new Error('Gagal menghubungi Gemini API. Coba lagi atau isi manual.');
  }

  const text = response.text;
  if (!text) {
    throw new Error('Gemini tidak mengembalikan respons. Coba lagi.');
  }

  // Strip markdown code fences if present (model sometimes wraps output)
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Gagal memproses respons AI. Coba upload ulang atau isi manual.');
  }

  // Validate required fields
  if (!parsed.title || typeof parsed.title !== 'string') {
    throw new Error('AI gagal membaca judul sertifikat. Coba isi manual.');
  }

  const suggestedCategory = parsed.suggested_category as string;
  if (!VALID_CATEGORIES.includes(suggestedCategory as Category)) {
    // Default to 'sertifikat' if AI gives invalid category
    parsed.suggested_category = 'sertifikat';
  }

  // Ensure suggested_tags is an array of strings
  if (!Array.isArray(parsed.suggested_tags)) {
    parsed.suggested_tags = [];
  } else {
    parsed.suggested_tags = (parsed.suggested_tags as unknown[])
      .filter((t): t is string => typeof t === 'string')
      .slice(0, 5)
      .map((t) => t.toLowerCase().trim());
  }

  return {
    title: parsed.title as string,
    title_en: (parsed.title_en as string) || undefined,
    issuer: (parsed.issuer as string) || null,
    issuer_en: (parsed.issuer_en as string) || null,
    date: (parsed.date as string) || null,
    description: (parsed.description as string) || null,
    description_en: (parsed.description_en as string) || null,
    suggested_category: parsed.suggested_category as Category,
    suggested_tags: parsed.suggested_tags as string[],
  };
}
