import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    // Lightweight query
    await supabase.from('achievements').select('id', { count: 'exact', head: true });
    
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false, error: 'Database connection failed' }, { status: 500 });
  }
}
