'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
            <p className="text-xl mb-4">An error occurred during authentication.</p>
            {error && <p className="text-red-500">Error: {error}</p>}
        </div>
    )
}

