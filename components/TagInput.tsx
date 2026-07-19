'use client';

import { useState, KeyboardEvent } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
        setInput('');
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.container}>
      <div className={styles.tagsWrapper}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className={styles.removeBtn}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Ketik lalu Enter..." : ""}
          className={styles.input}
        />
      </div>
    </div>
  );
}
