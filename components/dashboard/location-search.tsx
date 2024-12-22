'use client'

import * as React from "react"
import { Check, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
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
import { Checkbox } from "../ui/checkbox"

interface LocationSearchProps {
    onSelect: (locationId: string) => Promise<void>;
}


export function LocationSearch({ onSelect }: LocationSearchProps) {
    const [open, setOpen] = React.useState(false)
    const { locations, userLocations } = useLocations();

    const availableLocations = locations.filter((loc: { id: any }) =>
        !userLocations.some((userLoc: { locationId: any }) => userLoc.locationId === loc.id)
    );

    const handleLocationSelect = async (locationId: string) => {
        try {
            await onSelect(locationId);
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
                        {availableLocations.map((location: any) => (
                            <CommandItem
                                key={location.id}
                                value={location.id}
                                onSelect={handleLocationSelect}
                            >
                                <Checkbox
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                    )}
                                />
                                {location.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}