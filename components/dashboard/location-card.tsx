'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface LocationCardProps {
  location: {
    locationId: string;
    locationName: string;
    enabled: boolean;
    spots: Array<{
      id: string;
      name: string;
      enabled: boolean;
    }>;
  };
  onToggle: (locationId: string, enabled: boolean) => void;
  onRemove: (locationId: string) => void;
  onToggleSpot: (locationId: string, spotId: string) => void;
}

export function LocationCard({ location, onToggle, onRemove, onToggleSpot }: LocationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Card className="border-t-[5px] border-t-[#264E8A] border border-black/50">
      <div className="p-6">
        <h2 className="text-xl font-medium mb-2">{location.locationName}</h2>
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-sm text-blue-600 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'View'} surf spots in {location.locationName}
            {isExpanded ? (
              <ChevronUp className="inline ml-1" />
            ) : (
              <ChevronDown className="inline ml-1" />
            )}
          </span>
        </div>
        {isExpanded && (
          <div className="space-y-2 mb-4">
            {location.spots.map((spot) => (
              <div key={spot.id} className="flex items-center space-x-2">
                <Checkbox
                  id={spot.id}
                  checked={spot.enabled}
                  onCheckedChange={() => onToggleSpot(location.locationId, spot.id)}
                  className="border-[#264E8A] data-[state=checked]:bg-[#264E8A] data-[state=checked]:text-white"
                />
                <label
                  htmlFor={spot.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {spot.name}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end gap-4 mt-4">
          <div
            className="bg-white rounded-md p-2 cursor-pointer hover:bg-gray-50"
            onClick={() => onRemove(location.locationId)}
          >
            <Trash2 className="h-5 w-5 text-black" />
          </div>
          <Switch
            checked={location.enabled}
            onCheckedChange={(checked) => onToggle(location.locationId, checked)}
            className="bg-[#ADE2DF]"
          />
        </div>
      </div>
    </Card>
  );
}