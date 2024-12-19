import { Session } from 'next-auth'
import { ADMIN_EMAIL } from '@/lib/constants'

export function isAdmin(email?: string | null): boolean {
  return email === ADMIN_EMAIL
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}

export function hasRequiredScopes(session: Session | null, requiredScopes: string[]): boolean {
  const sessionScopes = (session as any)?.scope?.split(' ') || []
  return requiredScopes.every(scope => sessionScopes.includes(scope))
}