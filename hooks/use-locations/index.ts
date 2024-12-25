'use client';

import { useState, useEffect } from 'react';
import { Location } from './types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

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
      toast({
        title: 'Error',
        description: 'Failed to load your locations',
        variant: 'destructive'
      });
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
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch locations';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addUserLocation = async (locationId: string) => {
    try {
      setIsAddingLocation(true);

      const existingLocation = userLocations.find(loc => loc.locationId === locationId);
      if (existingLocation) {
        toast({
          title: 'Location exists',
          description: 'You have already added this location',
          variant: 'destructive'
        });
        return null;
      }

      const currentLocations = await loadLocations();
      const location = currentLocations.find((loc: any) => loc._id.oid === locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      const payload = {
        locationId: location._id.oid,
        locationName: location.name,
        spots: location.spots.map((spot: any) => ({
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
    } finally {
      setIsAddingLocation(false);
    }
  };

  const updateLocationSpots = async (locationId: string, spots: any[]) => {
    try {
      console.log('Sending update request for location:', locationId); // Debug log

      const response = await fetch(`/api/locations/user/${locationId}/spots`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spots })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to update spots');
      }

      const updatedLocation = await response.json();

      setUserLocations(prev =>
        prev.map(loc =>
          loc._id.oid === locationId ? { ...loc, spots } : loc
        )
      );

      toast({
        title: 'Success',
        description: 'Spots updated successfully'
      });

      return updatedLocation;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update spots';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateLocationEnabled = async (locationId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/locations/user/${locationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      const updatedLocation = await response.json();

      setUserLocations(prev =>
        prev.map(loc =>
          loc.locationId === locationId ? { ...loc, enabled } : loc
        )
      );

      toast({
        title: 'Success',
        description: `Location ${enabled ? 'enabled' : 'disabled'} successfully`
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
    isAddingLocation,
    error,
    addUserLocation,
    deleteUserLocation,
    updateLocationSpots,
    updateLocationEnabled,
    loadLocations,
    loadUserLocations,
    refresh: loadLocations,
  };
}