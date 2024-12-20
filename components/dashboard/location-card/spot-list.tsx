import { Spot } from '@/hooks/use-locations/types';
import { Checkbox } from '@/components/ui/checkbox';

interface SpotListProps {
    spots: Spot[];
    onToggleSpot: (spotId: string) => void;
}

export function SpotList({ spots, onToggleSpot }: SpotListProps) {
    return (
        <div className="mt-4 space-y-2 border-t pt-4">
            {spots.map(spot => (
                <div
                    key={spot.id}
                    className="flex items-center gap-3"
                >
                    <Checkbox
                        id={spot.id}
                        checked={spot.active}
                        onCheckedChange={() => onToggleSpot(spot.id)}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                        htmlFor={spot.id}
                        className="text-sm text-gray-700 cursor-pointer"
                    >
                        {spot.name}
                    </label>
                </div>
            ))}
        </div>
    );
}