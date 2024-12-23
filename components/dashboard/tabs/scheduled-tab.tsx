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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/slots');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSlots(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Failed to fetch slots. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
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

