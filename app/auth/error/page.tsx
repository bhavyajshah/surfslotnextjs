import { Suspense } from 'react';
import Link from 'next/link';

export default function ErrorPage({
    searchParams,
}: {
    searchParams: { error?: string };
}) {
    const error = searchParams?.error;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight">
                        Authentication Error
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {error === 'AccessDenied' ? (
                            <>
                                You have denied access to some required permissions. You can still use the app, but some features might be limited.
                                <br />
                                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                                    Try signing in again
                                </Link>
                            </>
                        ) : (
                            'An error occurred during authentication. Please try again.'
                        )}
                    </p>
                    <Link
                        href="/"
                        className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}