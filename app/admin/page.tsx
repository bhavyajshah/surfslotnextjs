import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/config'
import { AdminDashboard } from '@/components/admin/dashboard'
import { isAdmin, isAuthenticated } from '@/lib/auth/utils/auth-checks'
import { ROUTES } from '@/lib/constants'

export default async function AdminPage() {
  const session = await getServerSession(authConfig)

  if (!isAuthenticated(session)) {
    redirect(ROUTES.AUTH.SIGNIN)
  }

  if (!isAdmin(session?.user?.email)) {
    redirect(ROUTES.DASHBOARD)
  }

  return <AdminDashboard />
}