export interface GoogleProfile {
  iss?: string;
  azp?: string;
  aud?: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash?: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale?: string;
  iat?: number;
  exp?: number;
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
  expiry_date?: Date;
}