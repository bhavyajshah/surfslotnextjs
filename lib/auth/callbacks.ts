import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

export const callbacks = {
  async jwt({ token, account, user }: any) {
    // Initial sign in
    if (account && user) {
      return {
        ...token,
        accessToken: account.access_token,
        refreshToken: account.refresh_token,
        scope: account.scope,
        userId: user.id,
      }
    }

    // Return previous token if the access token has not expired yet
    return token
  },
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.userId as string
      session.accessToken = token.accessToken as string
      ;(session as any).scope = token.scope
    }
    return session
  },
  async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    // Allows relative callback URLs
    if (url.startsWith("/")) return `${baseUrl}${url}`
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  }
}