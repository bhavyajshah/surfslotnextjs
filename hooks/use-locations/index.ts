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

  // Load user locations on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadUserLocations();
    }
  }, [session?.user?.id]);

  const loadUserLocations = async () => {
    try {
      const response = await fetch('/api/locations/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user locations');
      }
      const data = await response.json();
      setUserLocations(data);
    } catch (error) {
      console.error('Error loading user locations:', error);
    }
  };

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
      // Load locations if they haven't been loaded yet
      if (locations.length === 0) {
        await loadLocations();
      }

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
      const response = await fetch(`/api/locations/user/${locationId}`, {
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

  return {
    locations,
    userLocations,
    isLoading,
    error,
    addUserLocation,
    deleteUserLocation,
    // toggleSpot,
    loadLocations,
    loadUserLocations,
    refresh: loadLocations,
  };
}