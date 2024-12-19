'use client';

import { useState } from 'react';
import { AdminSidebar } from './sidebar';
import { LocationsManager } from './locations-manager';
import { SettingsManager } from './settings-manager';
import { Analytics } from './analytics';
import { Header } from './header';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('locations');

  const sections = {
    locations: <LocationsManager />,
    settings: <SettingsManager />,
    analytics: <Analytics />
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          {sections[activeSection as keyof typeof sections]}
        </main>
      </div>
    </div>
  );
}