import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  return session;
}

export async function requireNoAuth() {
  const session = await getSession();
  
  if (session) {
    redirect("/dashboard");
  }
}