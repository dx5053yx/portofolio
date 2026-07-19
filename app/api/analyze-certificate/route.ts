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
