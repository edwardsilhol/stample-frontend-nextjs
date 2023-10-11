import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     * 6. all root files inside /public/icons
     */
    '/((?!api|_next|examples|icons|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  if (path === '/') {
    return NextResponse.redirect(new URL('/me', request.url));
  }

  return NextResponse.next();
}
