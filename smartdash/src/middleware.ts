import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/api', '/public'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const auth = request.cookies.get('auth')?.value;

  console.log("🔐 Auth:", auth);
  console.log("🛣️ Pathname:", pathname);
  console.log("🧩 Is Public:", isPublic);

  if (isPublic) return NextResponse.next();

  if (!auth || auth !== "true") {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
