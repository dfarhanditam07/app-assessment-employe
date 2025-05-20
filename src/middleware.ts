import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  console.log('token:', token);
  console.log('role:', role);
  console.log('pathname:', pathname);
  // Jika belum login, wajib ke login dulu kecuali sudah di halaman login
  if (!token) {
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Jika sudah login dan akses halaman login, redirect sesuai role
  if (pathname === '/login') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (role === 'user') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Role: admin
  if (role === 'admin') {
    // Admin hanya boleh akses dashboard dan assessment
    if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/assessment')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Role: user
  if (role === 'user') {
    // User hanya boleh akses root (halaman utama) dan assessment
    if (pathname !== '/' && !pathname.startsWith('/assessment')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Default lanjutkan akses
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/assessment/:path*']
};
