import { useState, useEffect } from 'react';
import { Location, UseLocationsReturn } from './types';
import {
  fetchLocationsApi,
  removeLocationApi,
  toggleLocationApi,
  toggleSpotApi,
} from './api';

export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const data = await fetchLocationsApi();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = async () => {
    // Implementation for adding a new location
    // To be implemented based on requirements
  };

  const removeLocation = async (locationId: string) => {
    try {
      await removeLocationApi(locationId);
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
    } catch (error) {
      console.error('Error removing location:', error);
    }
  };

  const toggleLocation = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      await toggleLocationApi(locationId, !location.active);
      setLocations(prev =>
        prev.map(loc =>
          loc.id === locationId ? { ...loc, active: !loc.active } : loc
        )
      );
    } catch (error) {
      console.error('Error toggling location:', error);
    }
  };

  const toggleSpot = async (locationId: string, spotId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      const spot = location.spots.find(s => s.id === spotId);
      if (!spot) return;

      await toggleSpotApi(locationId, spotId, !spot.active);
      setLocations(prev =>
        prev.map(loc =>
          loc.id === locationId
            ? {
                ...loc,
                spots: loc.spots.map(s =>
                  s.id === spotId ? { ...s, active: !s.active } : s
                ),
              }
            : loc
        )
      );
    } catch (error) {
      console.error('Error toggling spot:', error);
    }
  };

  return {
    locations,
    isLoading,
    addLocation,
    removeLocation,
    toggleLocation,
    toggleSpot,
  };
}

export * from './types';