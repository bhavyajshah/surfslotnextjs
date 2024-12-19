'use client';

import { Spot } from '@/hooks/use-locations/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SpotSelectorProps {
    spots: Spot[];
    selectedSpots: string[];
    onToggle: (spotId: string) => void;
    onSubmit: () => void;
}

export function SpotSelector({
    spots,
    selectedSpots,
    onToggle,
    onSubmit
}: SpotSelectorProps) {
    return (
        <Card className="p-4">
            <h3 className="font-medium mb-4">Select surf spots to monitor</h3>
            <div className="space-y-2 mb-4">
                {spots.map(spot => (
                    <div key={spot.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={spot.id}
                            checked={selectedSpots.includes(spot.id)}
                            onCheckedChange={() => onToggle(spot.id)}
                        />
                        <label htmlFor={spot.id} className="text-sm">
                            {spot.name}
                        </label>
                    </div>
                ))}
            </div>
            <Button
                onClick={onSubmit}
                disabled={selectedSpots.length === 0}
                className="w-full"
            >
                Add Selected Spots
            </Button>
        </Card>
    );
}