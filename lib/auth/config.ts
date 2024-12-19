import { NextAuthOptions } from "next-auth"
import { callbacks } from "./callbacks"
import { providers } from "./providers"
import { ROUTES } from "@/lib/constants"

export const authConfig: NextAuthOptions = {
  providers,
  callbacks,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: ROUTES.AUTH.SIGNIN,
    error: ROUTES.AUTH.ERROR,
  },
  debug: process.env.NODE_ENV === 'development',
}