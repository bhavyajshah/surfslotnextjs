'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarAccessNotificationProps {
  onRequestAccess: () => void;
}

export function CalendarAccessNotification({ onRequestAccess }: CalendarAccessNotificationProps) {
  return (
    <Alert variant="destructive" className="max-w-6xl mx-auto mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="ml-2 flex items-center justify-between">
        <span>
          The access to your calendar is missing so that surfslot can schedule the events in your calendar.
        </span>
        <Button variant="outline" size="sm" onClick={onRequestAccess} className="ml-4">
          Provide Access
        </Button>
      </AlertDescription>
    </Alert>
  );
}