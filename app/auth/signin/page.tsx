import { Suspense } from 'react';
import SignInContent from './SignInContent';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <SignInContent />
        </Suspense>
      </div>
    </div>
  );
}

