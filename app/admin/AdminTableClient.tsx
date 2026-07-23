'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteAchievement, toggleFeatured, updateSortOrder } from './actions';
import type { Achievement } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import styles from './admin.module.css';

export default function AdminTableClient({ achievements }: { achievements: Achievement[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus entri ini?')) {
      try {
        await deleteAchievement(id);
        router.refresh();
      } catch {
        alert('Gagal menghapus');
      }
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured(id, !currentFeatured);
      router.refresh();
    } catch {
      alert('Gagal mengupdate featured status');
    }
  };

  const handleUpdateSortOrder = async (id: string, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      try {
        await updateSortOrder(id, num);
        router.refresh();
      } catch {
        alert('Gagal update sort order');
      }
    }
  };

  const filteredAchievements = achievements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                        (a.issuer && a.issuer.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter ? a.category === categoryFilter : true;
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <>
      <div className={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Cari judul atau issuer..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.filterInput}
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Urutan</th>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Tanggal</th>
            <th>Featured</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredAchievements.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Tidak ada hasil yang cocok dengan filter.
              </td>
            </tr>
          ) : (
            filteredAchievements.map((item) => (
              <tr key={item.id}>
                <td>
                  <span 
                    className={`${styles.statusDot} ${item.status === 'published' ? styles.statusPublished : styles.statusDraft}`} 
                    title={item.status}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    defaultValue={item.sort_order}
                    onBlur={(e) => handleUpdateSortOrder(item.id, e.target.value)}
                    className={styles.sortInput}
                  />
                </td>
                <td>{item.title}</td>
                <td>
                  <span className={styles.categoryTag}>{item.category}</span>
                </td>
                <td>{item.date_achieved || '-'}</td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={item.featured} 
                    onChange={() => handleToggleFeatured(item.id, item.featured)}
                  />
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/edit/${item.id}`} className={styles.actionLink}>Edit</Link>
                    <span>|</span>
                    <button onClick={() => handleDelete(item.id)} className={styles.actionBtn}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
