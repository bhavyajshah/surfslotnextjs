'use client';

import { useSearchParams } from 'next/navigation';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

export default function SignInContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const error = searchParams.get('error');

    return (
        <>
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
        </>
    );
}

