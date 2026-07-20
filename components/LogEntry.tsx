import React from 'react';
import styles from './LogEntry.module.css';

interface LogEntryProps {
  date: string;
  status: 'shipped' | 'building' | 'published' | 'featured' | 'draft' | 'archived';
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  category?: string;
  verifyUrl?: string;
  imageUrl?: string;
}

export function LogEntry({
  date,
  status,
  title,
  subtitle,
  description,
  tags,
  category,
  verifyUrl,
  imageUrl,
}: LogEntryProps) {
  // Determine status dot modifier class based on globals.css
  const statusClass = `status-dot--${status}`;

  return (
    <div className={styles.entry}>
      <div className={styles.timeline}>
        <div className={`status-dot ${statusClass}`} />
        <div className={styles.line} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.date}>{date}</span>
            <span className={styles.statusText}>{status}</span>
            {category && <span className={styles.category}>[{category}]</span>}
          </div>
          <h3 className={styles.title}>
            {title}
            {verifyUrl && (
              <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className={styles.verifyLink} aria-label="Verify">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </h3>
        </div>
        
        {imageUrl && (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
            <img src={imageUrl} alt={title} className={styles.thumbnail} />
          </a>
        )}

        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {description && <p className={styles.description}>{description}</p>}
        
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
