'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLocations } from '@/hooks/use-locations';

export function LocationForm() {
  const [city, setCity] = useState('');
  const [spotName, setSpotName] = useState('');
  const [conditions, setConditions] = useState({
    waveHeight: '',
    wind: '',
    tide: '',
    bestTimeToSurf: []
  });
  const { toast } = useToast();
  const { addLocation } = useLocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addLocation({
        city,
        name: spotName,
        spots: [{
          name: spotName,
          conditions
        }]
      });

      toast({
        title: 'Success',
        description: 'Location added successfully'
      });

      setCity('');
      setSpotName('');
      setConditions({
        waveHeight: '',
        wind: '',
        tide: '',
        bestTimeToSurf: []
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add location',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Spot Name</label>
        <Input
          value={spotName}
          onChange={(e) => setSpotName(e.target.value)}
          placeholder="Enter spot name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Wave Height</label>
        <Select
          value={conditions.waveHeight}
          onChange={(value) => setConditions(prev => ({ ...prev, waveHeight: value }))}
          options={[
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]}
        />
      </div>
      <Button type="submit">Add Location</Button>
    </form>
  );
}