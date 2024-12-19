import NextAuth from "next-auth"
import { authConfig } from "./lib/auth/config"

const { auth, signIn, signOut } = NextAuth(authConfig)

export { auth, signIn, signOut }