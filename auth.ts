import NextAuth from "next-auth"
import { authConfig } from "./lib/auth/config"

const handler = NextAuth(authConfig)

export const auth = handler.auth
export const signIn = handler.signIn
export const signOut = handler.signOut