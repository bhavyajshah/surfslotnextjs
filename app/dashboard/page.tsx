import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import DashboardContent from "@/components/dashboard/dashboard-content"
import { ErrorBoundary } from "react-error-boundary"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent user={session.user} />
      </Suspense>
    </ErrorBoundary>
  )
}

