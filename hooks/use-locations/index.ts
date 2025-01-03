'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export interface Location {
  _id: { oid: string };
  name: string;
  spots: Spot[];
}

export interface Spot {
  id: string;
  name: string;
  enabled: boolean;
}

export interface UserLocation {
  _id: { oid: string };
  locationId: string;
  locationName: string;
  spots: Spot[];
  enabled: boolean;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isUpdatingLocations, setIsUpdatingLocations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  // Use refs to track request states
  const isLoadingRef = useRef(false);
  const initialLoadCompleteRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadUserLocations = useCallback(async () => {
    // Prevent concurrent requests and unnecessary reloads
    if (isLoadingRef.current || !session?.user?.id || initialLoadCompleteRef.current) return;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      isLoadingRef.current = true;
      setIsLoading(true);

      const response = await fetch('/api/locations/user', {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user locations');
      }

      const data = await response.json();
      setUserLocations(data);
      initialLoadCompleteRef.current = true;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignore aborted requests
      }
      console.error('Error loading user locations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your locations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      setIsInitialized(true);
      abortControllerRef.current = null;
    }
  }, [session?.user?.id, toast]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // useEffect(() => {
  //   if (session?.user?.id && !initialLoadCompleteRef.current) {
  //     loadUserLocations();
  //   }
  // }, [session?.user?.id, loadUserLocations]);

  const loadLocations = useCallback(async () => {
    if (isLoadingRef.current) return;

    const controller = new AbortController();

    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/locations', {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      setLocations(data);
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignore aborted requests
      }
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
      isLoadingRef.current = false;
    }
  }, [toast]);

  const addUserLocation = useCallback(async (locationId: string) => {
    if (isAddingLocation) return;

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
      const location = currentLocations.find((loc: Location) => loc._id.oid === locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      const payload = {
        locationId: location._id.oid,
        locationName: location.name,
        spots: location.spots.map((spot: Spot) => ({
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
  }, [userLocations, loadLocations, toast, isAddingLocation]);

  const updateLocationSpots = useCallback(async (locationId: string, spots: Spot[]) => {
    if (isUpdatingLocations) return;

    try {
      setIsUpdatingLocations(true);
      console.log('Updating spots for location:', locationId);
      console.log('Current userLocations:', userLocations);
      console.log('Spots data:', JSON.stringify(spots, null, 2));
      const response = await fetch(`/api/locations/user/${locationId}/spots`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spots })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to update spots');
      }

      const updatedLocation = await response.json();
      console.log('Updated location:', updatedLocation);
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
      console.error('Error in updateLocationSpots:', error);
      const message = error instanceof Error ? error.message : 'Failed to update spots';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsUpdatingLocations(false);
    }
  }, [toast, isUpdatingLocations, userLocations]);

  const updateLocationEnabled = useCallback(async (locationId: string, enabled: boolean) => {
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
          loc._id.oid === locationId ? { ...loc, enabled } : loc
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
  }, [toast]);

  const deleteUserLocation = useCallback(async (locationId: string) => {
    try {
      // Optimistically update UI
      setUserLocations(prev => prev.filter(loc => loc._id.oid !== locationId));

      const response = await fetch(`/api/locations/user/${locationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete location');
      }

      toast({
        title: 'Success',
        description: 'Location removed successfully'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete location';
      console.error('Error deleting location:', error);

      await loadUserLocations();

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  }, [toast, loadUserLocations]);

  const refresh = useCallback(() => {
    initialLoadCompleteRef.current = false;
    loadUserLocations();
  }, [loadUserLocations]);

  return {
    locations,
    userLocations,
    setUserLocations,
    isLoading,
    isAddingLocation,
    isUpdatingLocations,
    error,
    isInitialized,
    addUserLocation,
    deleteUserLocation,
    updateLocationSpots,
    updateLocationEnabled,
    loadLocations,
    loadUserLocations,
    refresh,
  };
}