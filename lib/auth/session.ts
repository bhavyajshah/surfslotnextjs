import { getServerSession } from "next-auth"
import { authConfig } from "./config"
import { redirect } from "next/navigation"

export async function getSession() {
  return await getServerSession(authConfig)
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return session
}