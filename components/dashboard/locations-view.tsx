'use client';

import { useLocations } from '@/hooks/use-locations';
import { LocationCard } from '@/components/locations/location-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export function LocationsView() {
    const { locations, isLoading, error, updateLocation } = useLocations();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!locations.length) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    No surf spots available at the moment. Check back later!
                </AlertDescription>
            </Alert>
        );
    }

    const handleToggleSpot = async (locationId: string, spotId: string) => {
        const location = locations.find(loc => loc.id === locationId);
        if (!location) return;

        const spot = location.spots.find(s => s.id === spotId);
        if (!spot) return;

        await updateLocation(locationId, {
            spots: location.spots.map(s =>
                s.id === spotId ? { ...s, active: !s.active } : s
            )
        });
    };

    return (
        <div className="space-y-6">
            {locations.map(location => (
                <LocationCard
                    key={location.id}
                    location={location}
                    onToggleSpot={(spotId) => handleToggleSpot(location.id, spotId)}
                />
            ))}
        </div>
    );
}