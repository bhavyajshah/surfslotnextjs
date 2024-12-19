import { useState, useEffect } from 'react';
import { SurfSlot } from './types';
import { useGoogleCalendar } from '../use-google-calendar';
import { useToast } from '@/components/ui/use-toast';

export function useSurfSlots() {
  const [slots, setSlots] = useState<SurfSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { createSurfEvent } = useGoogleCalendar();
  const { toast } = useToast();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/slots');
      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch surf slots',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCalendar = async (slot: SurfSlot) => {
    try {
      await createSurfEvent(slot);
      toast({
        title: 'Success',
        description: 'Added to Google Calendar'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add to calendar',
        variant: 'destructive'
      });
    }
  };

  return {
    slots,
    isLoading,
    addToCalendar,
    refresh: fetchSlots
  };
}