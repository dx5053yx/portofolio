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
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;
      
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
