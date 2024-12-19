import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

export const callbacks = {
  async jwt({ token, account }: any) {
    if (account) {
      token.accessToken = account.access_token
      token.refreshToken = account.refresh_token
      token.scope = account.scope
    }
    return token
  },
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.sub as string
      session.accessToken = token.accessToken as string
      ;(session as any).scope = token.scope
    }
    return session
  }
}