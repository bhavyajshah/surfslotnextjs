import { useState, useEffect } from 'react';
import { Location, UseLocationsReturn } from './types';
import { fetchLocations, addLocation, updateLocation, deleteLocation } from './api';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await fetchLocations();
      setLocations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch locations',
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add location',
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update location',
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
      toast({
        title: 'Error',
        description: 'Failed to delete location',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    locations,
    isLoading,
    addLocation: handleAddLocation,
    updateLocation: handleUpdateLocation,
    deleteLocation: handleDeleteLocation,
    isAdmin: session?.user?.email === 'websitemaker923@gmail.com'
  };
}