'use server';

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
