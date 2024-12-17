import { Spot } from '@/hooks/use-locations/types';
import { Switch } from '@radix-ui/react-switch';

interface SpotListProps {
    spots: Spot[];
    onToggleSpot: (spotId: string) => void;
}

export function SpotList({ spots, onToggleSpot }: SpotListProps) {
    return (
        <div className="mt-4 space-y-2">
            {spots.map(spot => (
                <div
                    key={spot.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                    <span>{spot.name}</span>
                    <Switch
                        checked={spot.active}
                        onCheckedChange={() => onToggleSpot(spot.id)}
                    />
                </div>
            ))}
        </div>
    );
}