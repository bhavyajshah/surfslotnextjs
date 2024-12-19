import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { Suspense } from "react"
import DashboardContent from "@/components/dashboard/dashboard-content"
import { ErrorBoundary } from "react-error-boundary"

export default async function DashboardPage() {
  const session = await getServerSession(authConfig)

  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect admin users to admin dashboard
  if (session.user?.email === 'websitemaker923@gmail.com') {
    redirect('/admin')
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent user={session.user} />
      </Suspense>
    </ErrorBoundary>
  )
}