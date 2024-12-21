'use client';

import { useState } from 'react';
import { SurfSlot, UseScheduledSlotsReturn } from './types';

export function useScheduledSlots(): UseScheduledSlotsReturn {
  const [slots, setSlots] = useState<SurfSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/slots');
      if (!response.ok) {
        throw new Error('Failed to fetch slots');
      }
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch slots');
    } finally {
      setIsLoading(false);
    }
  };

  return { slots, isLoading, error, fetchSlots };
}