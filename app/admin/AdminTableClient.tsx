'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteAchievement, toggleFeatured } from './actions';
import type { Achievement } from '@/lib/types';
import styles from './admin.module.css';

export default function AdminTableClient({ achievements }: { achievements: Achievement[] }) {
  const router = useRouter();

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

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Status</th>
          <th>Judul</th>
          <th>Kategori</th>
          <th>Tanggal</th>
          <th>Featured</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {achievements.map((item) => (
          <tr key={item.id}>
            <td>
              <span 
                className={`${styles.statusDot} ${item.status === 'published' ? styles.statusPublished : styles.statusDraft}`} 
                title={item.status}
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
        ))}
      </tbody>
    </table>
  );
}
