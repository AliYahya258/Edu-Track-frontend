import { NextResponse } from 'next/server';
import { getToken } from '../utils/auth';

export function middleware(req) {
  const token = getToken();

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/auth/protected',  // Apply middleware only to protected routes
};
