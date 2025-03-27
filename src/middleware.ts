
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example middleware for authentication checks
  // Add your authentication logic here
  
  // For now, just pass through all requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add paths that need middleware protection here
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};
