'use client';

import { useState, useEffect } from 'react';
import { Location, UseLocationsReturn } from './types';
import { addLocation, updateLocation as updateLocationApi, deleteLocation } from './api';
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
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch locations');
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

  const handleUpdateLocation = async (id: string, data: Partial<Location>) => {
    try {
      const updatedLocation = await updateLocationApi(id, data);
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

  const handleToggleSpot = async (locationId: string, spotId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) throw new Error('Location not found');

      const spot = location.spots.find(s => s.id === spotId);
      if (!spot) throw new Error('Spot not found');

      const updatedSpots = location.spots.map(s =>
        s.id === spotId ? { ...s, active: !s.active } : s
      );

      const updatedLocation = await handleUpdateLocation(locationId, {
        ...location,
        spots: updatedSpots
      });

      return updatedLocation;
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

  const handleDeleteLocation = async (id: string) => {
    try {
      await deleteLocation(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast({
        title: 'Success',
        description: 'Location deleted successfully'
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
    addLocation,
    updateLocation: handleUpdateLocation,
    deleteLocation: handleDeleteLocation,
    toggleSpot: handleToggleSpot,
    refresh: loadLocations,
    isAdmin: isAdmin(session?.user?.email)
  };
}