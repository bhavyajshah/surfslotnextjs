'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export function SettingsTab() {
  return (
    <div className="max-w-3xl mx-auto">
      <Alert variant="secondary" className="bg-gray-100">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription className="ml-2">
          It is still not possible to edit settings for your surf slots like preferred conditions, 
          skill level, tides, availability or favourite periods to surf but we are working on new 
          cool stuff. Your input and help is welcome!
        </AlertDescription>
      </Alert>
    </div>
  );
}