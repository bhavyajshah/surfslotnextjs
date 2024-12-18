import { z } from "zod";

export const authResponseSchema = z.object({
  access_token: z.string(),
  id_token: z.string().optional(),
  expires_at: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string(),
  token_type: z.string(),
});

export const userProfileSchema = z.object({
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;