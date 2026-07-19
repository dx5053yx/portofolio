import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import styles from './admin.module.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.siteLink}>&larr; Ke Situs</Link>
          <span className={styles.separator}>/</span>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        <form action="/auth/logout" method="post">
          <button type="submit" className={styles.logoutBtn}>Logout</button>
        </form>
      </header>
      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
