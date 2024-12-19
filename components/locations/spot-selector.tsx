'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '../ui/checkbox';
import { useUser } from '@/hooks/use-user';

interface SpotSelectorProps {
    locationName: string;
    spots: {
        id: string;
        name: string;
        active: boolean;
    }[];
}

export function SpotSelector({ locationName, spots }: SpotSelectorProps) {
    const { user, updateSelectedSpots, toggleCalendarNotifications } = useUser();
    const [isExpanded, setIsExpanded] = useState(true);

    const handleSpotToggle = (spotId: string) => {
        const newSelectedSpots = user?.selectedSpots?.includes(spotId)
            ? user.selectedSpots.filter(id => id !== spotId)
            : [...(user?.selectedSpots || []), spotId];

        updateSelectedSpots(newSelectedSpots);
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{locationName}</h2>
                <Switch
                    checked={user?.calendarNotifications}
                    onCheckedChange={toggleCalendarNotifications}
                    aria-label="Toggle calendar notifications"
                />
            </div>

            <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-4">
                    Select spots to receive notifications
                </p>

                {spots.map(spot => (
                    <div key={spot.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={spot.id}
                            checked={user?.selectedSpots?.includes(spot.id)}
                            onCheckedChange={() => handleSpotToggle(spot.id)}
                        />
                        <label htmlFor={spot.id} className="text-sm font-medium">
                            {spot.name}
                        </label>
                    </div>
                ))}
            </div>
        </Card>
    );
}