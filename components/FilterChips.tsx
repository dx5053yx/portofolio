'use client';

import React from 'react';
import styles from './FilterChips.module.css';
import { Category } from '@/lib/types';

interface FilterChipsProps {
  categories: { value: Category | null; label: string; count: number }[];
  activeCategory: Category | null;
  onSelect: (category: Category | null) => void;
}

export function FilterChips({ categories, activeCategory, onSelect }: FilterChipsProps) {
  return (
    <div className={styles.container}>
      {categories.map((cat) => (
        <button
          key={cat.value || 'semua'}
          onClick={() => onSelect(cat.value)}
          className={`${styles.chip} ${activeCategory === cat.value ? styles.active : ''}`}
        >
          {cat.label} <span className={styles.count}>{cat.count}</span>
        </button>
      ))}
    </div>
  );
}
