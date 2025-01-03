'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarAccessNotificationProps {
  onRequestAccess: () => void;
}

export function CalendarAccessNotification({ onRequestAccess }: CalendarAccessNotificationProps) {
  return (
    <Alert variant="destructive" className="max-w-6xl mx-auto mb-4 p-3 sm:p-4">
      <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <AlertDescription className="flex-grow text-sm">
          The access to your calendar is missing so that surfslot can schedule the events in your calendar.
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={onRequestAccess}
          className="w-full sm:w-auto mt-2 sm:mt-0 whitespace-nowrap"
        >
          Provide Access
        </Button>
      </div>
    </Alert>
  );
}

