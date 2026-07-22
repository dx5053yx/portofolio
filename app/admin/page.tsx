import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './admin.module.css';
import AdminTableClient from './AdminTableClient';
import type { Achievement } from '@/lib/types';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h2>Kelola Entri</h2>
        <Link href="/admin/new" className={styles.addBtn}>+ Tambah Baru</Link>
      </div>
      
      <div className={styles.tableContainer}>
        {(!achievements || achievements.length === 0) ? (
          <div className={styles.emptyState}>
            Belum ada entri. Upload sertifikat pertama.
          </div>
        ) : (
          <AdminTableClient achievements={achievements as Achievement[]} />
        )}
      </div>
    </div>
  );
}
