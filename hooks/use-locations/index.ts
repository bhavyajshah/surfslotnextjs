import { useState, useEffect } from 'react';
import { Location, UseLocationsReturn } from './types';
import { fetchLocations, removeLocation, toggleLocation, toggleSpot } from './api';

export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error('Error fetching locations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = async () => {
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add location');
      }

      const newLocation = await response.json();
      setLocations(prev => [...prev, newLocation]);
      return newLocation;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const handleRemoveLocation = async (locationId: string) => {
    try {
      await removeLocation(locationId);
      setLocations(prev => prev.filter(loc => loc._id !== locationId));
    } catch (err) {
      console.error('Error removing location:', err);
    }
  };

  const handleToggleLocation = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc._id === locationId);
      if (!location) return;

      await toggleLocation(locationId, !location.enabled);
      setLocations(prev =>
        prev.map(loc =>
          loc._id === locationId ? { ...loc, enabled: !loc.enabled } : loc
        )
      );
    } catch (err) {
      console.error('Error toggling location:', err);
    }
  };

  const handleToggleSpot = async (locationId: string, spotId: string) => {
    try {
      const location = locations.find(loc => loc._id === locationId);
      if (!location) return;

      const spot = location.spots.find(s => s.id === spotId);
      if (!spot) return;

      await toggleSpot(locationId, spotId, !spot.active);
      setLocations(prev =>
        prev.map(loc =>
          loc._id === locationId
            ? {
                ...loc,
                spots: loc.spots.map(s =>
                  s.id === spotId ? { ...s, active: !s.active } : s
                ),
              }
            : loc
        )
      );
    } catch (err) {
      console.error('Error toggling spot:', err);
    }
  };

  return {
    locations,
    isLoading,
    error,
    addLocation,
    removeLocation: handleRemoveLocation,
    toggleLocation: handleToggleLocation,
    toggleSpot: handleToggleSpot,
  };
}

export * from './types';