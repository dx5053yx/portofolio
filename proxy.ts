import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  const { pathname, searchParams } = request.nextUrl;
  
  // Tangkap query param ?lang=en atau ?lang=id
  const lang = searchParams.get('lang');
  if (lang && (lang === 'en' || lang === 'id')) {
    supabaseResponse.cookies.set('NEXT_LOCALE', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  // Admin routes (except /admin/login) require authenticated admin user
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user || user.id !== process.env.ADMIN_USER_ID) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already logged in and visits /admin/login, redirect to /admin
  if (pathname === '/admin/login' && user && user.id === process.env.ADMIN_USER_ID) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = '/admin';
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - Static assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
