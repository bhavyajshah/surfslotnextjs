'use client';

import { User } from 'next-auth';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/dashboard/location-card';
import { useLocations } from '@/hooks/use-locations';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LocationsTabProps {
  user: User;
}

export function LocationsTab({ user }: LocationsTabProps) {
  const { locations, isLoading, addLocation, removeLocation, toggleLocation, toggleSpot } = useLocations();

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.image || ''}
              alt={user.name || ''}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{user.name}</span>
          </div>
          <Button
            onClick={() => addLocation()}
            className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new location
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">No locations found. Add a new location to get started!</div>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={user.image || ''}
            alt={user.name || ''}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{user.name}</span>
        </div>
        <Button
          onClick={() => addLocation()}
          className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new location
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            onToggle={() => toggleLocation(location.id)}
            onRemove={() => removeLocation(location.id)}
            onToggleSpot={(spotId) => toggleSpot(location.id, spotId)}
          />
        ))}
      </div>
    </div>
  );
}