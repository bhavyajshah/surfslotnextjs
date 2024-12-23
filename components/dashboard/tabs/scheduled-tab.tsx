'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SurfSlot {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
}

export function ScheduledTab() {
  const [slots, setSlots] = useState<SurfSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/slots');
      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="space-y-4 max-w-7xl mx-auto">
      {slots.map(slot => {
        const startDate = new Date(slot.start);
        const endDate = new Date(slot.end);

        return (
          <Card key={slot.id} className="p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl text-black font-medium">
              {startDate.toLocaleDateString()} from {startDate.toLocaleTimeString()} to {endDate.toLocaleTimeString()}
            </h3>
            <p className="text-gray-600 text-md mt-1">
              {slot.description}
            </p>
          </Card>
        );
      })}
      {slots.length > 0 && (
        <p className="text-gray-600 mt-8 pt-4 border-t">
          All the slots above are scheduled in your Google Calendar.
        </p>
      )}
    </div>
  );
}