'use client';

import { User } from 'next-auth';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/dashboard/location-card';
import { useLocations } from '@/hooks/use-locations';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface LocationsTabProps {
  user: User;
}

export function LocationsTab({ user }: LocationsTabProps) {
  const { locations, isLoading, updateLocation, toggleSpot } = useLocations();
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const { toast } = useToast();

  const availableLocations = locations.filter(loc => !loc.active);
  const activeLocations = locations.filter(loc => loc.active);

  const handleLocationSelect = async (locationId: string) => {
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      await updateLocation(locationId, { active: true });
      toast({
        title: 'Success',
        description: `${location.name} has been added to your locations`
      });
      setShowLocationSelect(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add location',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
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
          onClick={() => setShowLocationSelect(prev => !prev)}
          className="bg-[#B3E6E5] text-black hover:bg-[#93d6d5]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new location
        </Button>
      </div>

      {showLocationSelect && (
        <div className="mb-6">
          {availableLocations.length > 0 ? (
            <Select
              options={availableLocations.map(loc => ({
                label: `${loc.name}, ${loc.city}`,
                value: loc.id
              }))}
              onChange={handleLocationSelect}
              placeholder="Select a location to monitor"
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">All available locations have been added</div>
            </Alert>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeLocations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            onToggleSpot={(spotId) => toggleSpot(location.id, spotId)}
          />
        ))}
      </div>

      {activeLocations.length === 0 && !showLocationSelect && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            No locations added yet. Click "Add new location" to start monitoring surf spots.
          </div>
        </Alert>
      )}
    </div>
  );
}