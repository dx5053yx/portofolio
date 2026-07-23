'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './LanguageToggle.module.css';

export function LanguageToggle({ currentLang }: { currentLang: 'id' | 'en' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const toggleLang = () => {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    
    // Create new URLSearchParams to preserve other query parameters if any
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.toggleContainer}>
      <button 
        onClick={toggleLang} 
        className={styles.toggleBtn}
        aria-label="Toggle Language"
      >
        <span className={currentLang === 'id' ? styles.active : ''}>ID</span>
        <span className={styles.separator}>/</span>
        <span className={currentLang === 'en' ? styles.active : ''}>EN</span>
      </button>
    </div>
  );
}
