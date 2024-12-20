import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { ADMIN_EMAIL, ROUTES } from '@/lib/constants'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const userEmail = req.nextauth.token?.email

    // Dashboard routes protection
    if (pathname.startsWith('/dashboard')) {
      if (userEmail === ADMIN_EMAIL) {
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}