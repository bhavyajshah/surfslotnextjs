import { DefaultSession } from "next-auth"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    accessToken?: any
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

