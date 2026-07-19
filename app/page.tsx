import { createClient } from '@/lib/supabase/server';
import { LogEntry } from '@/components/LogEntry';
import { AchievementsList } from '@/components/AchievementsList';
import { ScrollAnimator } from '@/components/ScrollAnimator';
import { projects } from '@/data/projects';
import styles from './page.module.css';

export const revalidate = 3600;

export default async function Home() {
  const supabase = await createClient();
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('date_achieved', { ascending: false });

  return (
    <main className="container">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.statusLine}>
          <div className="status-dot status-dot--building" />
          <span>status: building · sejak 2024</span>
        </div>
        <h1 className={styles.name}>AKIRU</h1>
        <p className={styles.bio}>Informatics · Solo builder</p>
      </section>

      {/* Projects Section */}
      <section className="section" id="projects">
        <h2 className="section-title">PROJECTS</h2>
        <div>
          {projects.map((project, index) => (
            <ScrollAnimator key={project.title} delay={index * 100}>
              <LogEntry
                date={project.date}
                status={project.status}
                title={project.title}
                subtitle={project.stack.join(' · ')}
                description={project.description}
                verifyUrl={project.url}
              />
            </ScrollAnimator>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section" id="achievements">
        <h2 className="section-title">ACHIEVEMENTS</h2>
        <AchievementsList achievements={achievements || []} />
      </section>

      {/* About Section */}
      <section className="section" id="about">
        <div className={styles.about}>
          <p className={styles.aboutText}>
            Mahasiswa Informatika Universitas Jenderal Soedirman. Solo builder — suka bikin tools yang solve masalah nyata.
          </p>
          <div className={styles.links}>
            <a href="https://github.com/akiru" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
            <a href="mailto:akiru@email.com" className={styles.link}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2024 Akiru · built with Next.js + Supabase
        </p>
      </footer>
    </main>
  );
}
