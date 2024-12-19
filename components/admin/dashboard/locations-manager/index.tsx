import { useState } from 'react';
import { LocationList } from './location-list';
import { LocationForm } from './location-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function LocationsManager() {
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Locations</h2>
        <Button onClick={() => setIsAddingLocation(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {isAddingLocation ? (
        <LocationForm onClose={() => setIsAddingLocation(false)} />
      ) : (
        <LocationList />
      )}
    </div>
  );
}