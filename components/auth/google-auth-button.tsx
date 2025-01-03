'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

interface GoogleAuthButtonProps {
  callbackUrl?: string;
}

export function GoogleAuthButton({ callbackUrl = '/dashboard' }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
        prompt: 'consent',
        access_type: 'offline',
        scope: [
          'openid',
          'email',
          'profile',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.calendarlist.readonly'
        ].join(' ')
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 w-full"
    >
      <Image
        src="https://surfslot.pt/public/playground_assets/google-logo-png-suite-everything-you-need-know-about-google-newest-0-200h.png"
        alt="Google"
        width={20}
        height={20}
        className="mr-2"
      />
      {isLoading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  );
}