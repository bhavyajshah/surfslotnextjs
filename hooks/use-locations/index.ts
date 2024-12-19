'use client';

import { useState, useEffect } from 'react';
import { Location, UseLocationsReturn } from './types';
import { fetchLocations, addLocation, updateLocation, deleteLocation } from './api';
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
      const data = await fetchLocations();
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

  const handleAddLocation = async (data: Partial<Location>) => {
    try {
      const newLocation = await addLocation(data);
      setLocations(prev => [...prev, newLocation]);
      toast({
        title: 'Success',
        description: 'Location added successfully'
      });
      return newLocation;
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

  const handleUpdateLocation = async (id: string, data: Partial<Location>) => {
    try {
      const updatedLocation = await updateLocation(id, data);
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
    addLocation: handleAddLocation,
    updateLocation: handleUpdateLocation,
    deleteLocation: handleDeleteLocation,
    refresh: loadLocations,
    isAdmin: isAdmin(session?.user?.email)
  };
}