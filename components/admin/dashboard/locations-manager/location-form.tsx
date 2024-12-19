import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLocations } from '@/hooks/use-locations';

interface LocationFormProps {
  onClose: () => void;
}

export function LocationForm({ onClose }: LocationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    spotName: '',
    conditions: {
      waveHeight: '',
      wind: '',
      tide: '',
      bestTimeToSurf: [] as string[]
    }
  });

  const { addLocation } = useLocations();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLocation({
        name: formData.name,
        city: formData.city,
        spots: [{
          name: formData.spotName,
          conditions: formData.conditions
        }]
      });
      toast({ title: 'Location added successfully' });
      onClose();
    } catch (error) {
      toast({
        title: 'Error adding location',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location Name</label>
            <Input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter location name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              value={formData.city}
              onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Enter city"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Spot Name</label>
          <Input
            value={formData.spotName}
            onChange={e => setFormData(prev => ({ ...prev, spotName: e.target.value }))}
            placeholder="Enter spot name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Wave Height</label>
            <Select
              value={formData.conditions.waveHeight}
              onChange={value => setFormData(prev => ({
                ...prev,
                conditions: { ...prev.conditions, waveHeight: value }
              }))}
              options={[
                { label: 'Small (1-3ft)', value: 'small' },
                { label: 'Medium (3-5ft)', value: 'medium' },
                { label: 'Large (5-8ft)', value: 'large' },
                { label: 'Extra Large (8ft+)', value: 'xl' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Wind</label>
            <Select
              value={formData.conditions.wind}
              onChange={value => setFormData(prev => ({
                ...prev,
                conditions: { ...prev.conditions, wind: value }
              }))}
              options={[
                { label: 'Offshore', value: 'offshore' },
                { label: 'Onshore', value: 'onshore' },
                { label: 'Cross-shore', value: 'cross' }
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Location</Button>
        </div>
      </form>
    </Card>
  );
}