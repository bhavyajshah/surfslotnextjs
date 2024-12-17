'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Location } from '@/hooks/use-locations/types';
import { SpotList } from './spot-list';
import { Switch } from '@radix-ui/react-switch';

interface LocationCardProps {
    location: Location;
    onToggle: () => void;
    onRemove: () => void;
    onToggleSpot: (spotId: string) => void;
}

export function LocationCard({
    location,
    onToggle,
    onRemove,
    onToggleSpot
}: LocationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`border rounded-lg p-4 ${location.active ? 'bg-white' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{location.name}</h3>
                    {location.comingSoon && (
                        <span className="text-sm text-muted-foreground">(Coming soon)</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Switch checked={location.active} onCheckedChange={onToggle} />
                    <button
                        onClick={onRemove}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                View surf spots in {location.name}
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>

            {isExpanded && (
                <SpotList spots={location.spots} onToggleSpot={onToggleSpot} />
            )}
        </div>
    );
}