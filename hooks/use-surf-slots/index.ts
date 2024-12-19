'use client';

import { useState, useEffect } from 'react';
import { SurfSlot } from './types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { createSurfEvent } from '@/lib/google-calender';

export function useSurfSlots() {
  const [slots, setSlots] = useState<SurfSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/slots');
      if (!response.ok) {
        throw new Error('Failed to fetch surf slots');
      }
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch surf slots';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleSession = async (slot: SurfSlot) => {
    try {
      const startTime = new Date(slot.date);
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      await createSurfEvent(session, {
        spot: slot.spot,
        location: slot.location,
        conditions: slot.conditions,
        startTime,
        endTime
      });

      toast({
        title: 'Success',
        description: 'Surf session scheduled successfully'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to schedule surf session';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    slots,
    isLoading,
    error,
    scheduleSession,
    refresh: fetchSlots
  };
}