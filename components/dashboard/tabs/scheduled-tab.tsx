'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SurfSlot {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  userId: string;
}

export function ScheduledTab() {
  const [slots, setSlots] = useState<SurfSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchSlots = async (userId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/slots?userId=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch slots');
        }

        const data = await response.json();
        setSlots(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch slots');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.id) {
      fetchSlots(session.user.id);
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [session?.user?.id, status]);

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    } catch (e) {
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
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
      <Alert variant="secondary" className="max-w-6xl mx-auto">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription className="ml-2">
          No surfslots available for your selected spots. Check back later when the swell comes in.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {slots.map(slot => {
        const startDateTime = formatDateTime(slot.start);
        const endDateTime = formatDateTime(slot.end);

        return (
          <Card key={slot.id} className="overflow-hidden transition-all shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {startDateTime.date}
              </CardTitle>
              <p className="text-sm opacity-90">
                {startDateTime.time} - {endDateTime.time}
              </p>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{slot.summary}</h3>
              <div className="text-gray-600 space-y-2">
                {slot.description.split('\n').map((line, index) => (
                  <p key={index} className="text-sm">
                    {line || <br />}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      {slots.length > 0 && (
        <p className="text-gray-600 mt-8 pt-4  text-center">
          All slots are scheduled in your Google Calendar.
        </p>
      )}
    </div>
  );
}

