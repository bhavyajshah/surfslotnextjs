import type { NextAuthConfig } from "next-auth";
import { googleProvider } from "../providers/google";

export const authConfig: NextAuthConfig = {
  providers: [googleProvider],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
  debug: process.env.NODE_ENV === 'development',
};