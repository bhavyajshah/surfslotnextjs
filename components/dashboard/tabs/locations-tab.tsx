'use client';

import { User } from 'next-auth';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/dashboard/location-card';
import { useLocations } from '@/hooks/use-locations';

interface LocationsTabProps {
  user: User;
}

export function LocationsTab({ user }: LocationsTabProps) {
  const { locations, isLoading, addLocation, removeLocation, toggleLocation, toggleSpot } = useLocations();

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

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
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
      )}
    </div>
  );
}