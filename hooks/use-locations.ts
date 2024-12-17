'use client';

import { useState, useEffect } from 'react';

interface Spot {
  id: string;
  name: string;
  active: boolean;
}

interface Location {
  id: string;
  name: string;
  active: boolean;
  comingSoon?: boolean;
  spots: Spot[];
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = async () => {
    // Implementation for adding a new location
  };

  const removeLocation = async (locationId: string) => {
    try {
      await fetch(\`/api/locations/\${locationId}\`, {
        method: 'DELETE',
      });
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
    } catch (error) {
      console.error('Error removing location:', error);
    }
  };

  const toggleLocation = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      const updatedLocation = { ...location, active: !location.active };
      await fetch(\`/api/locations/\${locationId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: updatedLocation.active }),
      });

      setLocations(prev =>
        prev.map(loc =>
          loc.id === locationId ? updatedLocation : loc
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

      await fetch(\`/api/locations/\${locationId}/spots/\${spotId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !spot.active }),
      });

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