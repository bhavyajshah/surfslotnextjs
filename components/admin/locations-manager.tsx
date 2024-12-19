'use client';

import { useState } from 'react';
import { useLocations } from '@/hooks/use-locations';
import { SpotUpdateForm } from './spot-update-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { LocationForm } from './location-form';

export function LocationsManager() {
    const { locations, isLoading, addLocation, deleteLocation } = useLocations();
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState<{ id: string; name: string } | null>(null);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Locations</h2>
                <Button onClick={() => setIsAddingLocation(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                </Button>
            </div>

            {isAddingLocation && (
                <LocationForm
                    onSubmit={(data) => {
                        addLocation(data);
                        setIsAddingLocation(false);
                    }}
                    onCancel={() => setIsAddingLocation(false)}
                />
            )}

            <div className="grid gap-6">
                {locations.map(location => (
                    <Card key={location.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">{location.name}</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteLocation(location.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {location.spots.map(spot => (
                                <div key={spot.id} className="flex items-center justify-between">
                                    <span>{spot.name}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedSpot({ id: spot.id, name: spot.name })}
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Update Conditions
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            {selectedSpot && (
                <SpotUpdateForm
                    spotId={selectedSpot.id}
                    spotName={selectedSpot.name}
                    onSubmit={() => setSelectedSpot(null)}
                />
            )}
        </div>
    );
}