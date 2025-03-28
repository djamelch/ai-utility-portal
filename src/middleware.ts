
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth protection for admin and dashboard routes
  if (req.nextUrl.pathname.startsWith('/admin') && !session?.user) {
    return NextResponse.redirect(new URL('/auth?from=/admin', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/dashboard') && !session?.user) {
    return NextResponse.redirect(new URL('/auth?from=/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
