'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SpotSelector } from './spot-selector';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Location } from '@/hooks/use-locations/types';

interface LocationCardProps {
    location: Location;
    onToggleSpot: (spotId: string) => void;
}

export function LocationCard({ location, onToggleSpot }: LocationCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Card className="p-6 border-t-4 border-[#264E8A]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{location.name}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {isExpanded && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Hide surf spots in {location.name}
                    </p>

                    <SpotSelector
                        spots={location.spots}
                        onToggleSpot={onToggleSpot}
                    />
                </div>
            )}
        </Card>
    );
}