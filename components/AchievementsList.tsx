'use client';

import React, { useState, useMemo } from 'react';
import { LogEntry } from './LogEntry';
import { FilterChips } from './FilterChips';
import { ScrollAnimator } from './ScrollAnimator';
import type { Achievement, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';

interface AchievementsListProps {
  achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '????.??';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
  };

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    achievements.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });

    const list = [
      { value: null, label: 'Semua', count: achievements.length },
      ...CATEGORIES.map(c => ({
        value: c.value,
        label: c.label,
        count: counts[c.value] || 0
      }))
    ];

    return list.filter(c => c.count > 0);
  }, [achievements]);

  const filtered = useMemo(() => {
    if (!activeCategory) return achievements;
    return achievements.filter(a => a.category === activeCategory);
  }, [achievements, activeCategory]);

  if (achievements.length === 0) {
    return <p className="mono">Belum ada pencapaian yang ditampilkan.</p>;
  }

  return (
    <div>
      <FilterChips
        categories={categoriesWithCounts}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div>
        {filtered.length === 0 ? (
          <p className="mono">Tidak ada item di kategori ini.</p>
        ) : (
          filtered.map((achievement, index) => (
            <ScrollAnimator key={achievement.id} delay={Math.min(index * 100, 500)}>
              <LogEntry
                date={formatDate(achievement.date_achieved)}
                status={achievement.featured ? 'featured' : 'published'}
                title={achievement.title}
                subtitle={achievement.issuer || undefined}
                description={achievement.description || undefined}
                tags={achievement.tags}
                category={achievement.category}
                verifyUrl={achievement.verify_url || undefined}
                imageUrl={achievement.file_url || undefined}
              />
            </ScrollAnimator>
          ))
        )}
      </div>
    </div>
  );
}
