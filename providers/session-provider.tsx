'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
    children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider refetchInterval={0}>
            {children}
        </NextAuthSessionProvider>
    );
}