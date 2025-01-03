'use client'

import * as React from "react"
import { Loader2} from 'lucide-react'
import { useLocations } from "@/hooks/use-locations"
import { PlusIcon } from "../icons";

interface LocationSearchProps {
    onSelect: (locationId: string) => Promise<void>;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const { locations, userLocations, loadLocations, isLoading, isAddingLocation } = useLocations();
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    React.useEffect(() => {
        if (!open) {
            setSearch('');
        }
    }, [open]);

    const handleOpenChange = () => {
        if (!open) {
            loadLocations();
        }
        setOpen(!open);
    };

    const availableLocations = locations.filter((loc: any) =>
        !userLocations.some((userLoc: { locationId: string }) => userLoc.locationId === loc._id.oid) &&
        loc.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleLocationSelect = async (locationId: string) => {
        try {
            await onSelect(locationId);
            setOpen(false);
            setSearch('');
        } catch (error) {
            console.error('Failed to add location:', error);
        }
    };

    return (
        <div className="relative w-[200px]" ref={dropdownRef}>
            <div
                className="flex items-center gap-2 bg-[#ADE2DF] hover:bg-[#9CD8D5] text-black px-3 py-2 rounded-full cursor-pointer transition-colors duration-200"
                onClick={handleOpenChange}
            >
                {isAddingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                        <PlusIcon className="h-4 w-4" />
                )}
                <span className="text-[15px]">{isAddingLocation ? 'Adding location...' : 'Add new location'}</span>

            </div>
            {open && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <input
                        type="text"
                        placeholder="Search location..."
                        className="w-full px-3 py-2 border-b border-gray-200 rounded-t-md focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="max-h-60 overflow-y-auto">
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
                                <div
                                    key={location._id.oid}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                    onClick={() => handleLocationSelect(location._id.oid)}
                                >
                                    {location.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}