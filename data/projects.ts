import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    date: '2026.03',
    status: 'shipped',
    title: 'NihonZ',
    stack: ['React', 'Firebase', 'Zustand'],
    description: 'Aplikasi belajar JLPT N4 dengan mekanik RPG — heart, combo, boss battle.',
    description_en: 'JLPT N4 learning app with RPG mechanics — heart, combo, boss battle.',
  },
  {
    date: '2025.09',
    status: 'shipped',
    title: 'siPandu',
    stack: ['Next.js', 'Supabase', 'Gemini'],
    description: 'Chatbot WhatsApp + dashboard analitik buat UMKM.',
    description_en: 'WhatsApp chatbot + analytics dashboard for MSMEs.',
  },
];
