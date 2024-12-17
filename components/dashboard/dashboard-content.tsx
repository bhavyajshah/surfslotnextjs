'use client';

import { useState } from 'react';
import { User } from 'next-auth';
import { LocationsTab } from './tabs/locations-tab';
import { SettingsTab } from './tabs/settings-tab';
import { ScheduledTab } from './tabs/scheduled-tab';
import { CalendarAccessNotification } from './notifications/calendar-access';
import { SubscriptionNotification } from './notifications/subscription';
import { UserDropdown } from './user-dropdown';

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('locations');
  const [hasCalendarAccess, setHasCalendarAccess] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const handleCalendarAccess = async () => {
    // Implement calendar access request
  };

  const handleSubscriptionActivate = async () => {
    // Implement subscription activation
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">my surfslots</h1>
            <UserDropdown user={user} />
          </div>
          <nav className="flex gap-6 mt-6">
            <button
              onClick={() => setActiveTab('locations')}
              className={\`pb-2 \${
                activeTab === 'locations'
                  ? 'border-b-2 border-primary font-semibold'
                  : 'text-muted-foreground'
              }\`}
            >
              locations
            </button>
            <button
              onClick={() => setActiveTab('surf settings')}
              className={\`pb-2 \${
                activeTab === 'surf settings'
                  ? 'border-b-2 border-primary font-semibold'
                  : 'text-muted-foreground'
              }\`}
            >
              surf settings
            </button>
            <button
              onClick={() => setActiveTab('scheduled surfslots')}
              className={\`pb-2 \${
                activeTab === 'scheduled surfslots'
                  ? 'border-b-2 border-primary font-semibold'
                  : 'text-muted-foreground'
              }\`}
            >
              scheduled surfslots
            </button>
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
  );
}