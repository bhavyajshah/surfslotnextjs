import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

// Use Node.js runtime
export const runtime = 'nodejs';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

