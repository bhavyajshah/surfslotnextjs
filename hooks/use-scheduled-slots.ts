'use client';

import { useState, useEffect } from 'react';

interface SurfSlot {
  id: string;
  date: string;
  location: string;
  spot: string;
  conditions: {
    waveHeight: string;
    wind: string;
    tide: string;
  };
}

export function useScheduledSlots() {
  const [slots, setSlots] = useState<SurfSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/slots');
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { slots, isLoading };
}