const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const full = path.join('/home/akiru/Documents/porto', file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
  console.log(`Created ${file}`);
};

// 1. Admin layout
write('app/admin/layout.tsx', `
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
`);

write('app/admin/admin.module.css', `
.adminContainer {
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
}

.adminHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--panel);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.headerLeft {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.siteLink {
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.siteLink:hover {
  color: var(--accent-teal);
}

.separator {
  color: var(--text-muted);
}

.title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin: 0;
  font-weight: 500;
}

.logoutBtn {
  background: none;
  border: 1px solid var(--text-muted);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.logoutBtn:hover {
  border-color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.adminMain {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Dashboard specific */
.dashboardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboardHeader h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin: 0;
}

.addBtn {
  background-color: var(--accent-teal);
  color: #000;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.addBtn:hover {
  opacity: 0.9;
}

.tableContainer {
  background-color: var(--panel);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.table th {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.table tr:last-child td {
  border-bottom: none;
}

.statusDot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.statusPublished {
  background-color: var(--accent-teal);
}

.statusDraft {
  background-color: var(--text-muted);
}

.categoryTag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actionLink {
  color: var(--accent-teal);
  text-decoration: none;
  font-size: 0.875rem;
}

.actionBtn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
}

.actionBtn:hover, .actionLink:hover {
  text-decoration: underline;
}

.emptyState {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}
`);

write('app/auth/logout/route.ts', `
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 303,
  });
}
`);

write('app/admin/login/page.tsx', `
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Email atau password salah.');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin Login</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
`);

write('app/admin/login/login.module.css', `
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg);
  font-family: var(--font-body);
}

.loginBox {
  background-color: var(--panel);
  padding: 2.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--text);
  margin-top: 0;
  margin-bottom: 2rem;
  text-align: center;
}

.error {
  background-color: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.field input {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
  padding: 0.75rem;
  border-radius: 4px;
  outline: none;
  font-family: var(--font-body);
}

.field input:focus {
  border-color: var(--accent-teal);
}

.submitBtn {
  background-color: var(--accent-teal);
  color: #000;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  font-family: var(--font-mono);
}

.submitBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
`);

write('components/TagInput.tsx', `
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
`);

write('components/TagInput.module.css', `
.container {
  display: flex;
  flex-direction: column;
}

.tagsWrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  min-height: 42px;
  align-items: center;
}

.tagsWrapper:focus-within {
  border-color: var(--accent-teal);
}

.tag {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.removeBtn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.removeBtn:hover {
  color: #ff6b6b;
}

.input {
  flex: 1;
  min-width: 120px;
  background: transparent;
  border: none;
  color: var(--text);
  outline: none;
  font-family: var(--font-body);
  padding: 0.25rem;
}
`);

write('components/AchievementForm.tsx', `
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
    } catch (err: any) {
      setAiError(err.message || 'Gagal baca sertifikat. Coba upload ulang atau isi manual.');
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
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal menyimpan data.');
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
`);

write('components/AchievementForm.module.css', `
.formContainer {
  background-color: var(--panel);
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.layout {
  display: flex;
  gap: 2rem;
  flex-direction: column;
}

@media (min-width: 768px) {
  .layout {
    flex-direction: row;
  }
  .leftCol {
    width: 300px;
    flex-shrink: 0;
  }
  .rightCol {
    flex: 1;
  }
}

.fieldGroup {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.row {
  display: flex;
  gap: 1rem;
}

.row .fieldGroup {
  flex: 1;
}

.label {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-family: var(--font-body);
}

.input, .textarea, .select {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
  padding: 0.75rem;
  border-radius: 4px;
  outline: none;
  font-family: var(--font-body);
  width: 100%;
}

.input:focus, .textarea:focus, .select:focus {
  border-color: var(--accent-teal);
}

.textarea {
  resize: vertical;
}

.fileInput {
  margin-bottom: 0.5rem;
}

.previewContainer {
  width: 100%;
  aspect-ratio: 4/3;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.previewImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pdfPreview {
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.aiBtn {
  background-color: rgba(232, 166, 92, 0.2);
  color: var(--accent-amber);
  border: 1px solid var(--accent-amber);
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.aiBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.errorText {
  color: #ff6b6b;
  font-size: 0.75rem;
}

.successText {
  color: var(--accent-teal);
  font-size: 0.75rem;
  font-weight: bold;
}

.errorBox {
  background-color: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.checkboxGroup {
  display: flex;
  align-items: center;
  flex: 1;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text);
  font-size: 0.875rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.submitBtn {
  background-color: var(--accent-teal);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-mono);
}

.submitBtn:disabled {
  opacity: 0.7;
}
`);

write('app/admin/actions.ts', `
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Needs service role key to bypass RLS or do admin stuff
async function getAdminClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { /* ... */ }
      }
    }
  );
}

export async function deleteAchievement(id: string) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function toggleFeatured(id: string, featured: boolean) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from('achievements').update({ featured }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function revalidateHome() {
  revalidatePath('/');
}
`);

write('app/admin/new/page.tsx', `
'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AchievementForm from '@/components/AchievementForm';
import { revalidateHome } from '../actions';
import type { AchievementFormData } from '@/lib/types';
import styles from '../admin.module.css';
import Link from 'next/link';

export default function NewAchievementPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (data: AchievementFormData, file: File | null) => {
    let fileUrl = data.file_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random()}.\${fileExt}\`;
      const filePath = \`certificates/\${fileName}\`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('certificates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);
        
      fileUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('achievements').insert([
      {
        ...data,
        file_url: fileUrl,
      }
    ]);

    if (insertError) throw insertError;

    await revalidateHome();
    alert('Berhasil disimpan!');
    router.push('/admin');
    router.refresh();
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h2>Tambah Entri Baru</h2>
        <Link href="/admin" className={styles.actionLink}>&larr; Kembali</Link>
      </div>
      <AchievementForm onSubmit={handleSubmit} />
    </div>
  );
}
`);

write('app/admin/edit/[id]/page.tsx', `
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditClientPage from './EditClientPage';
import { Achievement } from '@/lib/types';

export default async function EditAchievementPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const { data: achievement, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !achievement) {
    return <div>Entri tidak ditemukan.</div>;
  }

  return <EditClientPage initialData={achievement as Achievement} id={id} />;
}
`);

write('app/admin/edit/[id]/EditClientPage.tsx', `
'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AchievementForm from '@/components/AchievementForm';
import { revalidateHome } from '../../actions';
import type { Achievement, AchievementFormData } from '@/lib/types';
import styles from '../../admin.module.css';
import Link from 'next/link';

export default function EditClientPage({ initialData, id }: { initialData: Achievement, id: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (data: AchievementFormData, file: File | null) => {
    let fileUrl = data.file_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random()}.\${fileExt}\`;
      const filePath = \`certificates/\${fileName}\`;
      
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);
        
      fileUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('achievements')
      .update({
        ...data,
        file_url: fileUrl,
      })
      .eq('id', id);

    if (updateError) throw updateError;

    await revalidateHome();
    alert('Berhasil diupdate!');
    router.push('/admin');
    router.refresh();
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h2>Edit Entri</h2>
        <Link href="/admin" className={styles.actionLink}>&larr; Kembali</Link>
      </div>
      <AchievementForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
`);

write('app/admin/page.tsx', `
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './admin.module.css';
import AdminTableClient from './AdminTableClient';
import type { Achievement } from '@/lib/types';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: achievements, error } = await supabase
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
`);

write('app/admin/AdminTableClient.tsx', `
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteAchievement, toggleFeatured } from './actions';
import type { Achievement } from '@/lib/types';
import styles from './admin.module.css';

export default function AdminTableClient({ achievements }: { achievements: Achievement[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus entri ini?')) {
      try {
        await deleteAchievement(id);
        router.refresh();
      } catch (err) {
        alert('Gagal menghapus');
      }
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured(id, !currentFeatured);
      router.refresh();
    } catch (err) {
      alert('Gagal mengupdate featured status');
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Status</th>
          <th>Judul</th>
          <th>Kategori</th>
          <th>Tanggal</th>
          <th>Featured</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {achievements.map((item) => (
          <tr key={item.id}>
            <td>
              <span 
                className={\`\${styles.statusDot} \${item.status === 'published' ? styles.statusPublished : styles.statusDraft}\`} 
                title={item.status}
              />
            </td>
            <td>{item.title}</td>
            <td>
              <span className={styles.categoryTag}>{item.category}</span>
            </td>
            <td>{item.date_achieved || '-'}</td>
            <td>
              <input 
                type="checkbox" 
                checked={item.featured} 
                onChange={() => handleToggleFeatured(item.id, item.featured)}
              />
            </td>
            <td>
              <div className={styles.actions}>
                <Link href={\`/admin/edit/\${item.id}\`} className={styles.actionLink}>Edit</Link>
                <span>|</span>
                <button onClick={() => handleDelete(item.id)} className={styles.actionBtn}>Hapus</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`);

write('app/api/analyze-certificate/route.ts', `
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeCertificate } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    const result = await analyzeCertificate(base64, file.type);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error analyzing certificate:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
`);

write('app/api/health/route.ts', `
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    // Lightweight query
    await supabase.from('achievements').select('id', { count: 'exact', head: true });
    
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Database connection failed' }, { status: 500 });
  }
}
`);

