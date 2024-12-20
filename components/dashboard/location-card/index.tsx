import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SpotList } from './spot-list';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Location } from '@/hooks/use-locations/types';

interface LocationCardProps {
    location: Location;
    onToggle: () => void;
    onRemove: () => void;
    onToggleSpot: (spotId: string) => void;
}

export function LocationCard({ location, onToggle, onRemove, onToggleSpot }: LocationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{location.name}</h3>
                    <div className="flex items-center gap-4">
                        <Switch
                            checked={location.active}
                            onCheckedChange={onToggle}
                            className="data-[state=checked]:bg-blue-500"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onRemove}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                    {isExpanded ? 'Hide' : 'View'} surf spots in {location.name}
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>

                {isExpanded && (
                    <SpotList
                        spots={location.spots}
                        onToggleSpot={onToggleSpot}
                    />
                )}
            </div>
        </Card>
    );
}