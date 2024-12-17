'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface GoogleAuthButtonProps {
    callbackUrl?: string;
}

export function GoogleAuthButton({ callbackUrl = '/dashboard' }: GoogleAuthButtonProps) {
    const handleSignIn = async () => {
        try {
            await signIn('google', {
                callbackUrl,
                scope: [
                    'openid',
                    'email',
                    'profile',
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar.readonly'
                ].join(' ')
            });
        } catch (error) {
            console.error('Sign in error:', error);
        }
    };

    return (
        <Button
            onClick={handleSignIn}
            className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
        >
            <Image
                src="https://surfslot.pt/public/playground_assets/google-logo-png-suite-everything-you-need-know-about-google-newest-0-200h.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
            />
            Sign in with Google
        </Button>
    );
}