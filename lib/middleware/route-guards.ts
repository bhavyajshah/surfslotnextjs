import { NextResponse } from "next/server";

export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/', '/auth/signin'];
  return publicRoutes.includes(pathname);
}

export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth');
}

export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

export function redirectToLogin(baseUrl: string, returnPath: string): NextResponse {
  const signInUrl = new URL('/auth/signin', baseUrl);
  signInUrl.searchParams.set('callbackUrl', returnPath);
  return NextResponse.redirect(signInUrl);
}