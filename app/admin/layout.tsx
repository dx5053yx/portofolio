import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import styles from './admin.module.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is enforced by proxy.ts (layer 1) and RLS (layer 2).
  // This layout just provides the nav chrome.
  // The login page renders under this layout too, so we don't redirect here
  // to avoid an infinite loop — proxy.ts already handles that.

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not authenticated, render children without the admin nav
  // (this case only happens for /admin/login since proxy.ts blocks others)
  if (!user) {
    return <>{children}</>;
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
