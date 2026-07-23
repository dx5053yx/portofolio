// === Database types ===

export type Category = 'sertifikat' | 'kompetisi' | 'organisasi' | 'proyek';
export type Status = 'draft' | 'published';

export interface Achievement {
  id: string;
  title: string;
  title_en?: string;
  category: Category;
  issuer: string | null;
  issuer_en?: string | null;
  date_achieved: string | null; // ISO date string (YYYY-MM-DD)
  description: string | null;
  description_en?: string | null;
  file_url: string | null;
  verify_url: string | null;
  featured: boolean;
  status: Status;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// === Form types ===

export type AchievementFormData = Omit<Achievement, 'id' | 'created_at' | 'updated_at'>;

// === AI types ===

export interface AiAnalysisResult {
  title: string;
  title_en?: string;
  issuer: string | null;
  issuer_en?: string | null;
  date: string | null;
  description: string | null;
  description_en?: string | null;
  suggested_category: Category;
  suggested_tags: string[];
}

// === Project types (hardcoded data) ===

export type ProjectStatus = 'shipped' | 'building' | 'archived';

export interface Project {
  date: string;       // Format: YYYY.MM
  status: ProjectStatus;
  title: string;
  stack: string[];
  description: string;
  description_en?: string;
  url?: string;
}

// === Category metadata ===

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'sertifikat', label: 'Sertifikat' },
  { value: 'kompetisi', label: 'Kompetisi' },
  { value: 'organisasi', label: 'Organisasi' },
  { value: 'proyek', label: 'Proyek' },
];
