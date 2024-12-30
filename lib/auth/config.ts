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
      try {
        if (!account || !profile || !user.email) return false;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        // Format tokens object
        const tokens = {
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          scope: account.scope,
          token_type: account.token_type,
          id_token: account.id_token,
          expiry_date: account.expires_at ? new Date(account.expires_at * 1000) : undefined
        };

        // Format profile object
        const userProfile = {
          id: profile.sub,
          email: profile.email,
          verified_email: profile.email_verified,
          name: profile.name,
          given_name: profile.given_name,
          family_name: profile.family_name,
          picture: profile.picture
        };

        if (existingUser) {
          // Update existing user
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: profile.name,
              image: profile.picture,
              profile: userProfile,
              tokens: tokens,
              enabled: true
            }
          });

          // Update or create account
          if (existingUser.accounts.length === 0) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state
              }
            });
          }
        } else {
          // Create new user with formatted data
          await prisma.user.create({
            data: {
              email: user.email,
              name: profile.name,
              image: profile.picture,
              profile: userProfile,
              tokens: tokens,
              enabled: true,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                }
              }
            }
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, account, profile, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.scope = account.scope;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId as string;
        (session as any).accessToken = token.accessToken as string;
        (session as any).scope = token.scope;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('/auth/signin')) {
        return `${baseUrl}/dashboard`;
      }
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    }
  },
  pages: {
    signIn: ROUTES.AUTH.SIGNIN,
    error: ROUTES.AUTH.ERROR,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development"
};