import { createClient } from '@/lib/supabase/server';
import { projects } from '@/data/projects';
import { cookies } from 'next/headers';
import styles from './cv.module.css';
import Link from 'next/link';
import { PrintButton } from './PrintButton';

export const revalidate = 3600;

export default async function CVPage() {
  const supabase = await createClient();
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('date_achieved', { ascending: false });

  const cookieStore = await cookies();
  const lang = (cookieStore.get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'id') as 'id' | 'en';

  const formatMonth = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const d = new Date(dateString);
    const month = d.toLocaleString(lang === 'en' ? 'en-US' : 'id-ID', { month: 'long' });
    return `${month} ${d.getFullYear()}`;
  };

  return (
    <div className={styles.cvContainer}>
      <div className={styles.noPrint}>
        <Link href="/" className={styles.backBtn}>&larr; {lang === 'en' ? 'Back' : 'Kembali'}</Link>
        <PrintButton label={lang === 'en' ? 'Print / Save as PDF' : 'Cetak / Simpan sebagai PDF'} />
      </div>

      <div className={styles.printHeader}>
        <h1>Aqil Fachri Al Habsy (Akiru)</h1>
        <p>Informatics Student · Solo Builder</p>
        <div className={styles.contact}>
          <span>aqilfahrialhabsy@gmail.com</span>
          <span>github.com/dx5053yx</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2>{lang === 'en' ? 'PROJECTS' : 'PROYEK'}</h2>
        <div className={styles.items}>
          {projects.map((project) => (
            <div key={project.title} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{project.title}</span>
                <span className={styles.itemDate}>{project.date.replace('.', '-')}</span>
              </div>
              <div className={styles.itemSubtitle}>{project.stack.join(' · ')}</div>
              <p className={styles.itemDescription}>
                {lang === 'en' && project.description_en ? project.description_en : project.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>{lang === 'en' ? 'ACHIEVEMENTS' : 'PENCAPAIAN'}</h2>
        <div className={styles.items}>
          {(achievements || []).map((achievement) => (
            <div key={achievement.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>
                  {lang === 'en' && achievement.title_en ? achievement.title_en : achievement.title}
                </span>
                <span className={styles.itemDate}>{formatMonth(achievement.date_achieved)}</span>
              </div>
              {(achievement.issuer || achievement.issuer_en) && (
                <div className={styles.itemSubtitle}>
                  {lang === 'en' && achievement.issuer_en ? achievement.issuer_en : achievement.issuer}
                </div>
              )}
              <p className={styles.itemDescription}>
                {lang === 'en' && achievement.description_en ? achievement.description_en : achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
