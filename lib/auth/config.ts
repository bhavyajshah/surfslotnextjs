import { NextAuthOptions } from "next-auth";
import { callbacks } from "./callbacks";
import { providers } from "./providers";
import { ROUTES } from "@/lib/constants";

export const authConfig: NextAuthOptions = {
  providers,
  callbacks: {
    ...callbacks,
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign in
      if (url.includes('/auth/signin') || url === baseUrl || url === '/') {
        return `${baseUrl}/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: ROUTES.AUTH.SIGNIN,
    error: ROUTES.AUTH.ERROR,
  },
  debug: process.env.NODE_ENV === 'development',
};