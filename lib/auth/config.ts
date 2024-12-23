import { NextAuthOptions } from "next-auth";
import { providers } from "./providers";
import { ROUTES } from "@/lib/constants";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          // Update or create user with Google profile data
          await prisma.user.upsert({
            where: { email: user.email! },
            update: {
              name: user.name,
              image: user.image,
              profile: profile,
              tokens: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                scope: account.scope,
                token_type: account.token_type,
                id_token: account.id_token,
                expiry_date: account.expires_at
              },
              updatedAt: new Date()
            },
            create: {
              email: user.email!,
              name: user.name,
              image: user.image,
              profile: profile,
              tokens: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                scope: account.scope,
                token_type: account.token_type,
                id_token: account.id_token,
                expiry_date: account.expires_at
              }
            }
          });
          return true;
        } catch (error) {
          console.error("Error saving user data:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('/auth/signin') || url === baseUrl || url === '/') {
        return `${baseUrl}/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: ROUTES.AUTH.SIGNIN,
    error: ROUTES.AUTH.ERROR,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};