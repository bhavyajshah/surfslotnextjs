import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { isPublicRoute, isAuthRoute, isDashboardRoute, redirectToLogin } from "@/lib/middleware/route-guards";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    // Public routes configuration
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Auth routes handling
    if (isAuthenticated && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Dashboard protection
    if (!isAuthenticated && isDashboardRoute(pathname)) {
      return redirectToLogin(req.url, pathname);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

