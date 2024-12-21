'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useScheduledSlots } from '@/hooks/use-scheduled-slots';

export function ScheduledTab() {
  const { slots, isLoading, fetchSlots } = useScheduledSlots();

  useEffect(() => {
    fetchSlots();
  }, []);

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
    <div className="space-y-4 max-w-6xl mx-auto">
      {slots.map(slot => (
        <Card key={slot.id} className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-xl text-black font-medium">
            {slot.date} from {slot.startTime} to {slot.endTime}
          </h3>
          <p className="text-gray-600 text-md mt-1">
            {slot.conditions} in {slot.spot} at {slot.location}
          </p>
        </Card>
      ))}
      {slots.length > 0 && (
        <p className="text-gray-600 mt-8 pt-4 border-t">
          All the slots above are scheduled in your Google Calendar.
        </p>
      )}
    </div>
  );
}