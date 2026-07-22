'use client';

import { useState } from 'react';
import type { Achievement, AchievementFormData, Category, Status } from '@/lib/types';
import TagInput from './TagInput';
import styles from './AchievementForm.module.css';
import { CATEGORIES } from '@/lib/types';

interface AchievementFormProps {
  initialData?: Achievement;
  onSubmit: (data: AchievementFormData, file: File | null) => Promise<void>;
}

export default function AchievementForm({ initialData, onSubmit }: AchievementFormProps) {
  const [formData, setFormData] = useState<AchievementFormData>({
    title: initialData?.title || '',
    category: initialData?.category || 'sertifikat',
    issuer: initialData?.issuer || '',
    date_achieved: initialData?.date_achieved || '',
    description: initialData?.description || '',
    file_url: initialData?.file_url || '',
    verify_url: initialData?.verify_url || '',
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
    status: initialData?.status || 'draft',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.file_url || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [isAiFilled, setIsAiFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsAiFilled(false);
      setAiError('');
    }
  };

  const handleAiGenerate = async () => {
    if (!file) {
      setAiError('Upload file dulu untuk menggunakan AI.');
      return;
    }
    
    setIsAiLoading(true);
    setAiError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      
      const res = await fetch('/api/analyze-certificate', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menganalisa');
      }
      
      setFormData(prev => ({
        ...prev,
        title: result.title || prev.title,
        issuer: result.issuer || prev.issuer,
        date_achieved: result.date || prev.date_achieved,
        description: result.description || prev.description,
        category: result.suggested_category || prev.category,
        tags: result.suggested_tags || prev.tags,
      }));
      setIsAiFilled(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal baca sertifikat. Coba upload ulang atau isi manual.';
      setAiError(msg);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await onSubmit(formData, file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data.';
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {submitError && <div className={styles.errorBox}>{submitError}</div>}
      
      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>File Sertifikat/Dokumen (Gambar/PDF)</label>
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            {preview && (
              <div className={styles.previewContainer}>
                {preview.endsWith('.pdf') || (file && file.type === 'application/pdf') ? (
                  <div className={styles.pdfPreview}>PDF Document</div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={preview} alt="Preview" className={styles.previewImage} />
                )}
              </div>
            )}
            
            <button 
              type="button" 
              onClick={handleAiGenerate}
              disabled={isAiLoading || !file}
              className={styles.aiBtn}
            >
              {isAiLoading ? 'Membaca sertifikat...' : 'Generate dengan AI'}
            </button>
            {aiError && <div className={styles.errorText}>{aiError}</div>}
            {isAiFilled && <div className={styles.successText}>✓ Diisi AI</div>}
          </div>
        </div>
        
        <div className={styles.rightCol}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Judul *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Kategori *</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value as Category})} 
                className={styles.select}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tanggal (Opsional)</label>
              <input 
                type="date" 
                value={formData.date_achieved} 
                onChange={e => setFormData({...formData, date_achieved: e.target.value})} 
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Penerbit (Opsional)</label>
            <input 
              type="text" 
              value={formData.issuer} 
              onChange={e => setFormData({...formData, issuer: e.target.value})} 
              className={styles.input}
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Deskripsi *</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required
              rows={4}
              className={styles.textarea}
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>URL Verifikasi (Opsional)</label>
            <input 
              type="url" 
              value={formData.verify_url} 
              onChange={e => setFormData({...formData, verify_url: e.target.value})} 
              className={styles.input}
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Tags</label>
            <TagInput 
              tags={formData.tags} 
              onChange={tags => setFormData({...formData, tags})} 
            />
          </div>
          
          <div className={styles.row}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                />
                Tampilkan sebagai Featured
              </label>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value as Status})} 
                className={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
