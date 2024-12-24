'use client'

import * as React from "react"
import { Plus, Loader2 } from 'lucide-react'
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useLocations } from "@/hooks/use-locations"

interface LocationSearchProps {
    onSelect: (locationId: string) => Promise<void>;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
    const [open, setOpen] = React.useState(false)
    const { locations, userLocations, loadLocations, isLoading, isAddingLocation } = useLocations();

    // Only load locations when opening the popover
    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            loadLocations();
        }
        setOpen(newOpen);
    };

    const availableLocations = locations.filter((loc: any) =>
        !userLocations.some((userLoc: { locationId: string }) => userLoc.locationId === loc._id.$oid)
    );

    const handleLocationSelect = async (locationId: string) => {
        try {
            await onSelect(locationId);
            setOpen(false);
        } catch (error) {
            console.error('Failed to add location:', error);
        }
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <div
                    className="flex items-center gap-2 bg-[#ADE2DF] hover:bg-[#ADE2DF] text-black px-3 py-2 rounded-full cursor-pointer"
                    role="combobox"
                    aria-expanded={open}
                >
                    {isAddingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    <span>{isAddingLocation ? 'Adding location...' : 'Add new location'}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandGroup>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : availableLocations.length === 0 ? (
                            <div className="text-center py-6 text-sm text-gray-500">
                                No available locations
                            </div>
                        ) : (
                            availableLocations.map((location: any) => (
                                <CommandItem
                                    key={location._id.$oid}
                                    value={location._id.$oid}
                                    onSelect={() => handleLocationSelect(location._id.$oid)}
                                    disabled={isAddingLocation}
                                >
                                    {location.name}
                                </CommandItem>
                            ))
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}