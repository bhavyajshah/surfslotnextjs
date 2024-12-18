import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const callbacks = {
  async jwt({ token, account, user }: any) {
    if (account) {
      token.accessToken = account.access_token;
      token.refreshToken = account.refresh_token;
      token.userId = user?.id;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.userId as string;
      session.accessToken = token.accessToken;
    }
    return session;
  },
};