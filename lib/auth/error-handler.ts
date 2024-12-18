import AuthError from "next-auth";

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function handleAuthError(error: unknown): AuthenticationError {
  console.error("Authentication error:", error);

  if (error instanceof Error) {
    return new AuthenticationError(
      "Authentication failed",
      "UNKNOWN_ERROR",
      error
    );
  }

  return new AuthenticationError(
    "Authentication failed",
    "UNKNOWN_ERROR"
  );
}