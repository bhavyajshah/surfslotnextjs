import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && pathname.startsWith('/auth')) {
    return Response.redirect(new URL('/dashboard', req.url));
  }

  // Protect dashboard routes
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/auth/signin', req.url));
  }
})

// Ensure middleware runs on these paths
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}