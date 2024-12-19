'use client'

import { useState, useEffect } from 'react'
import { User } from 'next-auth'
import { LocationsTab } from './tabs/locations-tab'
import { SettingsTab } from './tabs/settings-tab'
import { ScheduledTab } from './tabs/scheduled-tab'
import { CalendarAccessNotification } from './notifications/calendar-access'
import { SubscriptionNotification } from './notifications/subscription'
import { UserDropdown } from './user-dropdown'
import { signIn, useSession } from 'next-auth/react'

export default function DashboardContent({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState('locations')
  const [hasCalendarAccess, setHasCalendarAccess] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.accessToken) {
      const scope = (session as any)?.scope || ''
      const hasCalendarScope = scope.includes('https://www.googleapis.com/auth/calendar')
      setHasCalendarAccess(hasCalendarScope)
    }
  }, [session])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access the dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">my surfslots</h1>
            <UserDropdown user={user} />
          </div>
          <nav className="flex gap-6 mt-6">
            {['locations', 'surf settings', 'scheduled surfslots'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${activeTab === tab
                    ? 'border-b-2 border-primary font-semibold'
                    : 'text-muted-foreground'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!hasCalendarAccess && (
          <CalendarAccessNotification onRequestAccess={handleCalendarAccess} />
        )}
        {!hasActiveSubscription && (
          <SubscriptionNotification onActivate={handleSubscriptionActivate} />
        )}

        {activeTab === 'locations' && <LocationsTab user={user} />}
        {activeTab === 'surf settings' && <SettingsTab />}
        {activeTab === 'scheduled surfslots' && <ScheduledTab />}
      </main>
    </div>
  )

  async function handleCalendarAccess() {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        scope: 'https://www.googleapis.com/auth/calendar'
      })
    } catch (error) {
      console.error('Failed to request calendar access:', error)
    }
  }

  async function handleSubscriptionActivate() {
    try {
      setHasActiveSubscription(true)
    } catch (error) {
      console.error('Failed to activate subscription:', error)
    }
  }
}