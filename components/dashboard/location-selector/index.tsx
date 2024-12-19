'use client';

import { useState } from 'react';
import { Location } from '@/hooks/use-locations/types';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LocationDropdown } from './location-dropdown';
import { SpotSelector } from './spot-selector';

interface LocationSelectorProps {
    locations: Location[];
    onLocationSelect: (locationId: string, spotIds: string[]) => Promise<void>;
}

export function LocationSelector({ locations, onLocationSelect }: LocationSelectorProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
    const { toast } = useToast();

    const availableLocations = locations.filter(loc => !loc.active);

    const handleLocationChange = (locationId: string) => {
        const location = locations.find(loc => loc.id === locationId);
        setSelectedLocation(location || null);
        setSelectedSpots([]);
    };

    const handleSpotToggle = (spotId: string) => {
        setSelectedSpots(prev =>
            prev.includes(spotId)
                ? prev.filter(id => id !== spotId)
                : [...prev, spotId]
        );
    };

    const handleSubmit = async () => {
        if (!selectedLocation) return;

        try {
            await onLocationSelect(selectedLocation.id, selectedSpots);
            toast({
                title: 'Success',
                description: `${selectedLocation.name} has been added to your locations`
            });
            setSelectedLocation(null);
            setSelectedSpots([]);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add location',
                variant: 'destructive'
            });
        }
    };

    if (availableLocations.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No available locations to add</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            <LocationDropdown
                locations={availableLocations}
                onChange={handleLocationChange}
            />

            {selectedLocation && (
                <SpotSelector
                    spots={selectedLocation.spots}
                    selectedSpots={selectedSpots}
                    onToggle={handleSpotToggle}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}