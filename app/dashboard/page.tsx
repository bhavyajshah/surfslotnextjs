import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { Suspense } from "react"
import DashboardContent from "@/components/dashboard/dashboard-content"
import { ErrorBoundary } from "react-error-boundary"
import { isAdmin, isAuthenticated } from "@/lib/auth/utils/auth-checks"
import { ROUTES } from "@/lib/constants"

export default async function DashboardPage() {
  const session = await getServerSession(authConfig)

  if (!isAuthenticated(session)) {
    redirect(ROUTES.AUTH.SIGNIN)
  }

  if (isAdmin(session?.user?.email)) {
    redirect(ROUTES.ADMIN)
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent user={session.user} />
      </Suspense>
    </ErrorBoundary>
  )
}