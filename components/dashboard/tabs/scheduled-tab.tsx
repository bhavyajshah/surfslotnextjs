'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useScheduledSlots } from '@/hooks/use-scheduled-slots';

export function ScheduledTab() {
  const { slots, isLoading } = useScheduledSlots();

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!slots || slots.length === 0) {
    return (
      <Alert variant="secondary" className="max-w-3xl mx-auto">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription className="ml-2">
          There are no surfslots available for your selected spots. You will have some time 
          to get work done and prepare to when the swell comes in.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {slots.map(slot => (
        <div key={slot.id} className="p-4 bg-white rounded-lg shadow">
          {/* Slot details here */}
        </div>
      ))}
    </div>
  );
}