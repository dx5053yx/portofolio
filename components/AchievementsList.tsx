'use client';

import React, { useState, useMemo } from 'react';
import { LogEntry } from './LogEntry';
import { FilterChips } from './FilterChips';
import { ScrollAnimator } from './ScrollAnimator';
import type { Achievement, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';

interface AchievementsListProps {
  achievements: Achievement[];
  lang: 'id' | 'en';
}

export function AchievementsList({ achievements, lang }: AchievementsListProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

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

  // First filter by category
  const filteredByCategory = useMemo(() => {
    if (!activeCategory) return achievements;
    return achievements.filter(a => a.category === activeCategory);
  }, [achievements, activeCategory]);

  // Then extract unique tags from the category-filtered list
  const availableTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    filteredByCategory.forEach(a => {
      if (a.tags) {
        a.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    // Sort tags by frequency (descending), then alphabetically
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [filteredByCategory]);

  // Finally filter by tag if one is selected
  const filtered = useMemo(() => {
    if (!activeTag) return filteredByCategory;
    return filteredByCategory.filter(a => a.tags && a.tags.includes(activeTag));
  }, [filteredByCategory, activeTag]);

  // Reset active tag if category changes and the tag is no longer available
  React.useEffect(() => {
    if (activeTag && !availableTags.includes(activeTag)) {
      setActiveTag(null);
    }
  }, [activeCategory, availableTags, activeTag]);

  if (achievements.length === 0) {
    return <p className="mono">Belum ada pencapaian yang ditampilkan.</p>;
  }

  return (
    <div>
      <FilterChips
        categories={categoriesWithCounts}
        activeCategory={activeCategory}
        onSelect={(cat) => {
          setActiveCategory(cat);
          setActiveTag(null); // Reset tag when category changes
        }}
      />

      {availableTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              style={{
                background: activeTag === tag ? 'var(--accent-teal)' : 'transparent',
                color: activeTag === tag ? '#000' : 'var(--text-muted)',
                border: `1px solid ${activeTag === tag ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '0.25rem 0.75rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div>
        {filtered.length === 0 ? (
          <p className="mono">Tidak ada item di kategori ini.</p>
        ) : (
          filtered.map((achievement, index) => (
            <ScrollAnimator key={achievement.id} delay={Math.min(index * 100, 500)}>
              <LogEntry
                date={formatDate(achievement.date_achieved)}
                status={achievement.featured ? 'featured' : 'published'}
                title={lang === 'en' && achievement.title_en ? achievement.title_en : achievement.title}
                subtitle={lang === 'en' && achievement.issuer_en ? achievement.issuer_en : (achievement.issuer || undefined)}
                description={lang === 'en' && achievement.description_en ? achievement.description_en : (achievement.description || undefined)}
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
