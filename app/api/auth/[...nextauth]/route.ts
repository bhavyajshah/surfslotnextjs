import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

const handler = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async redirect({ url, baseUrl }) {
      // If the user is signing in, redirect to dashboard
      if (url.includes('/auth/signin')) {
        return `${baseUrl}/dashboard`;
      }
      // Default to the requested URL or baseUrl
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});

export { handler as GET, handler as POST };