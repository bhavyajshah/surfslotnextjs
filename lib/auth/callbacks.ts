import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { TokenService } from "./token-service";
import { handleAuthError } from "./error-handler";

export const callbacks = {
  async signIn({ account, profile }: any) {
    try {
      if (!profile?.email) {
        return false;
      }

      if (!profile.email_verified) {
        throw new Error("Email not verified");
      }

      return true;
    } catch (error) {
      console.error("Sign in error:", error);
      return false;
    }
  },

  async session({ session, token }: { session: Session; token: JWT }) {
    try {
      if (session.user) {
        session.user.id = token.sub!;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  async jwt({ token, account, trigger }: { token: JWT; account: any; trigger?: string }) {
    try {
      // Initial sign in
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number) * 1000) {
        return token;
      }

      // Access token has expired, try to refresh it
      return await TokenService.refreshAccessToken(token);
    } catch (error) {
      throw handleAuthError(error);
    }
  }
};