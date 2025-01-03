import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { isAuthenticated } from "@/lib/auth/utils/auth-checks"
import { ROUTES } from "@/lib/constants"
import MySurfSlots from "@/components/dashboard-components/MySurfSlots"

export default async function DashboardPage() {
  const session = await getServerSession(authConfig)

  if (!isAuthenticated(session)) {
    redirect(ROUTES.AUTH.SIGNIN)
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        {/* {session && <DashboardContent user={session.user} />} */}
        {session && <MySurfSlots user={session.user} />}
      </Suspense>
    </ErrorBoundary>
  )
}