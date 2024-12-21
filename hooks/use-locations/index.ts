'use client';

import { useState, useEffect } from 'react';
import { Location, UseLocationsReturn } from './types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { isAdmin } from '@/lib/auth/utils/auth-checks';

export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/locations');
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch locations';
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

  const updateLocation = async (id: string, data: Partial<Location>) => {
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      const updatedLocation = await response.json();
      setLocations(prev =>
        prev.map(loc => loc.id === id ? updatedLocation : loc)
      );

      toast({
        title: 'Success',
        description: 'Location updated successfully'
      });

      return updatedLocation;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update location';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const toggleSpot = async (locationId: string, spotId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) throw new Error('Location not found');

      const spot = location.spots.find(s => s.id === spotId);
      if (!spot) throw new Error('Spot not found');

      const response = await fetch(`/api/locations/${locationId}/spots/${spotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !spot.active })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle spot');
      }

      const updatedSpot = await response.json();
      setLocations(prev =>
        prev.map(loc =>
          loc.id === locationId
            ? {
                ...loc,
                spots: loc.spots.map(s =>
                  s.id === spotId ? { ...s, active: !s.active } : s
                )
              }
            : loc
        )
      );

      return updatedSpot;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle spot';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }

      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast({
        title: 'Success',
        description: 'Location removed successfully'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete location';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    locations,
    isLoading,
    error,
    updateLocation,
    deleteLocation,
    toggleSpot,
    refresh: loadLocations,
    isAdmin: isAdmin(session?.user?.email)
  };
}