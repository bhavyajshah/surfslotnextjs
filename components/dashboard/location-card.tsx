'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Location } from '@/hooks/use-locations/types';

interface LocationCardProps {
  location: Location;
  onToggle: () => void;
  onRemove: () => void;
  onToggleSpot: (spotId: string) => void;
}

export function LocationCard({ location, onToggle, onRemove, onToggleSpot }: any) {
  const [isHidden, setIsHidden] = React.useState(false);

  const handleCheckboxChange = (spotId: string) => {
    onToggleSpot(spotId);
  };

  const isComingSoon = location.comingSoon;

  if (isComingSoon) {
    return (
      <Card className="w-full bg-gray-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-gray-500 text-xl sm:text-2xl">{location.name}</CardTitle>
            <span className="text-sm text-gray-400">(Coming soon)</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm sm:text-base">View surf spots in {location.name}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="text-xl sm:text-2xl">{location.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHidden(!isHidden)}
            className="text-blue-600 font-normal text-sm w-full sm:w-auto sm:text-xs"
          >
            {isHidden ? (
              <span className="flex items-center justify-center sm:justify-start w-full">
                Show surf spots in {location.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center justify-center sm:justify-start w-full">
                Hide surf spots in {location.name}
                <ChevronUp className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isHidden && (
            <div className="grid gap-4">
            {location.spots.map((spot: { id: string; active: boolean; name: string }) => (
              <div key={spot.id} className="flex items-center space-x-2">
              <Checkbox
                id={spot.id}
                checked={spot.active}
                onCheckedChange={() => handleCheckboxChange(spot.id)}
              />
              <label
                htmlFor={spot.id}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {spot.name}
              </label>
              </div>
            ))}
            <div className="flex justify-end items-center gap-2 pt-2">
              <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500"
              onClick={onRemove}
              >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
              </Button>
              <Switch
              checked={location.active}
              onCheckedChange={onToggle}
              />
            </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}