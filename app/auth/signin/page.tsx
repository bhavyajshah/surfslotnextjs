'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">
              {error === 'OAuthSignin' && 'Error occurred during sign in. Please try again.'}
              {error === 'OAuthCallback' && 'Error occurred during callback. Please try again.'}
              {error === 'OAuthCreateAccount' && 'Error occurred creating account. Please try again.'}
              {error === 'EmailCreateAccount' && 'Error occurred creating account. Please try again.'}
              {error === 'Callback' && 'Error occurred during callback. Please try again.'}
              {error === 'Default' && 'An error occurred. Please try again.'}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <GoogleAuthButton callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}