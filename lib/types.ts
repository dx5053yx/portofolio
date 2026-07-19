// === Database types ===

export type Category = 'sertifikat' | 'kompetisi' | 'organisasi' | 'proyek';
export type Status = 'draft' | 'published';

export interface Achievement {
  id: string;
  title: string;
  category: Category;
  issuer: string | null;
  date_achieved: string | null; // ISO date string (YYYY-MM-DD)
  description: string | null;
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

export interface AchievementFormData {
  title: string;
  category: Category;
  issuer: string;
  date_achieved: string;
  description: string;
  file_url: string;
  verify_url: string;
  tags: string[];
  featured: boolean;
  status: Status;
}

// === AI types ===

export interface AiAnalysisResult {
  title: string;
  issuer: string | null;
  date: string | null;
  description: string | null;
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
  url?: string;
}

// === Category metadata ===

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'sertifikat', label: 'Sertifikat' },
  { value: 'kompetisi', label: 'Kompetisi' },
  { value: 'organisasi', label: 'Organisasi' },
  { value: 'proyek', label: 'Proyek' },
];
