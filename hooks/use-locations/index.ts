'use client';

import { useState, useEffect } from 'react';
import { Location } from './types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();


  // Only load locations initially
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


  const addUserLocation = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc._id.$oid === locationId);
      if (!location) throw new Error('Location not found');

      const payload = {
        locationId: location._id.$oid,
        locationName: location.name,
        spots: location.spots.map(spot => ({
          ...spot,
          enabled: true
        }))
      };

      const response = await fetch('/api/locations/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add location');
      }

      const newUserLocation = await response.json();
      setUserLocations(prev => [...prev, newUserLocation]);

      toast({
        title: 'Success',
        description: 'Location added successfully'
      });

      return newUserLocation;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add location';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

const deleteUserLocation = async (locationId: string) => {
    try {
      const response = await fetch(`/api/user/locations/${locationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }

      setUserLocations(prev => prev.filter(loc => loc.locationId !== locationId));
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

  const toggleSpot = async (locationId: string, spotId: string) => {
    try {
      const userLocation = userLocations.find(loc => loc.locationId === locationId);
      if (!userLocation) throw new Error('User location not found');

      const response = await fetch(`/api/user/locations/${locationId}/spots/${spotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !userLocation.spots.find((s: any) => s.id === spotId).enabled })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle spot');
      }

      const updatedLocation = await response.json();
      setUserLocations(prev =>
        prev.map(loc =>
          loc.locationId === locationId ? updatedLocation : loc
        )
      );

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

  return {
    locations,
    userLocations,
    isLoading,
    error,
    addUserLocation,
    deleteUserLocation,
    toggleSpot,
    loadLocations,
    refresh: loadLocations,
  };
}