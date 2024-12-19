import { NextAuthOptions } from "next-auth"
import { callbacks } from "./callbacks"
import { providers } from "./providers"

export const authConfig: NextAuthOptions = {
  providers,
  callbacks,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}