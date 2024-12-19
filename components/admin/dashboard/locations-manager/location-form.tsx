'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLocations } from '@/hooks/use-locations';
import { SpotForm } from './spot-form';
import { Location, Spot } from '@/hooks/use-locations/types';

interface LocationFormProps {
  onClose: () => void;
}

export function LocationForm({ onClose }: LocationFormProps) {
  const [locationData, setLocationData] = useState({
    name: '',
    city: '',
  });
  const [spots, setSpots] = useState<Partial<Spot>[]>([]);
  const { addLocation } = useLocations();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationData.name || !locationData.city || spots.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and add at least one spot',
        variant: 'destructive'
      });
      return;
    }

    try {
      await addLocation({
        ...locationData,
        spots: spots.map(spot => ({
          ...spot,
          active: false,
          conditions: spot.conditions || {
            waveHeight: 'medium',
            wind: 'offshore',
            tide: 'mid',
            bestTimeToSurf: ['morning', 'evening']
          }
        }))
      });

      toast({ title: 'Success', description: 'Location added successfully' });
      onClose();
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: 'Error',
        description: 'Failed to add location',
        variant: 'destructive'
      });
    }
  };

  const addSpot = (spot: Partial<Spot>) => {
    setSpots(prev => [...prev, spot]);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location Name</label>
            <Input
              value={locationData.name}
              onChange={e => setLocationData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter location name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              value={locationData.city}
              onChange={e => setLocationData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Enter city"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Spots</h3>
          {spots.map((spot, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{spot.name}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <SpotForm onAdd={addSpot} />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Location</Button>
        </div>
      </form>
    </Card>
  );
}