import { JWT, decode, encode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export class TokenService {
  static async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET!,
      });
      return !!decoded;
    } catch {
      return false;
    }
  }

  static async refreshAccessToken(token: JWT): Promise<JWT> {
    try {
      const account = await prisma.account.findFirst({
        where: {
          userId: token.sub!,
          provider: "google",
        },
      });

      if (!account?.refresh_token) {
        throw new Error("No refresh token");
      }

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: account.refresh_token,
        }),
      });

      const tokens = await response.json();

      if (!response.ok) {
        throw tokens;
      }

      // Update token in database
      await prisma.account.update({
        where: {
          id: account.id,
        },
        data: {
          access_token: tokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
          refresh_token: tokens.refresh_token ?? account.refresh_token,
        },
      });

      return {
        ...token,
        accessToken: tokens.access_token,
        accessTokenExpires: Math.floor(Date.now() / 1000 + tokens.expires_in),
        refreshToken: tokens.refresh_token ?? account.refresh_token,
      };
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
  }
}