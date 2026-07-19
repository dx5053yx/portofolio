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
