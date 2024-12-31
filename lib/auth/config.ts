import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

async function createUserCalendar(accessToken: string, userEmail: string) {
  try {
    const hash = crypto
      .createHash('sha256')
      .update(`${userEmail}-${Date.now()}`)
      .digest('hex');

    const calendarId = `${hash}@group.calendar.google.com`;

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: 'Surfslot Calendar',
        timeZone: 'UTC',
      }),
    });

    if (!response.ok) {
      console.warn('Failed to create calendar - continuing with signup');
      return null;
    }

    const calendarData = await response.json();
    return calendarData.id;

  } catch (error) {
    console.warn('Error creating calendar - continuing with signup:', error);
    return null;
  }
}

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.calendarlist.readonly',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        if (!account || !profile || !user.email) return false;

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        const tokens = {
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          scope: account.scope,
          token_type: account.token_type,
          id_token: account.id_token,
          expiry_date: account.expires_at ? new Date(account.expires_at * 1000) : undefined
        };

        const userProfile = {
          id: profile.sub,
          email: profile.email,
          verified_email: profile.email_verified,
          name: profile.name,
          given_name: profile.given_name,
          family_name: profile.family_name,
          picture: profile.picture
        };

        // Try to create calendar, but don't fail if it doesn't work
        const calendarId = account.scope?.includes('https://www.googleapis.com/auth/calendar')
          ? await createUserCalendar(account.access_token, user.email)
          : null;

        const subscriptionId = `sub_${crypto.randomBytes(10).toString('hex')}`;

        if (existingUser) {
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: profile.name,
              image: profile.picture,
              profile: userProfile,
              tokens: tokens,
              enabled: true,
              calendarId: calendarId || existingUser.calendarId, // Keep existing calendarId if creation fails
              subscription: existingUser.subscription || {
                id: subscriptionId,
                active: false,
              }
            }
          });
        } else {
          await prisma.user.create({
            data: {
              email: user.email,
              name: profile.name,
              image: profile.picture,
              profile: userProfile,
              tokens: tokens,
              enabled: true,
              calendarId: calendarId,
              subscription: {
                id: subscriptionId,
                active: false,
              },
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
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development"
};