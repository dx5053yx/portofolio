'use client';
import styles from './cv.module.css';

export function PrintButton({ label }: { label: string }) {
  return (
    <button onClick={() => window.print()} className={styles.printBtn}>
      {label}
    </button>
  );
}
