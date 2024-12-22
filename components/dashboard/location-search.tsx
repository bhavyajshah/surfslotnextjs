'use client';

import * as React from "react";
import { Check, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLocations } from "@/hooks/use-locations";

export function LocationSearch() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const { locations, userLocations, addUserLocation } = useLocations();

    const availableLocations = locations.filter(loc =>
        !userLocations.some(userLoc => userLoc.locationId === loc.id)
    );

    const handleLocationSelect = async (locationId: string) => {
        try {
            await addUserLocation(locationId);
            setValue("");
            setOpen(false);
        } catch (error) {
            console.error('Failed to add location:', error);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className="flex items-center gap-2 bg-[#ADE2DF] hover:bg-[#ADE2DF] text-black px-3 py-2 rounded-full cursor-pointer"
                    role="combobox"
                    aria-expanded={open}
                >
                    <Plus className="h-4 w-4" />
                    <span>Add new location</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                        {availableLocations.map((location) => (
                            <CommandItem
                                key={location.id}
                                value={location.id}
                                onSelect={() => handleLocationSelect(location.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === location.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {location.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}