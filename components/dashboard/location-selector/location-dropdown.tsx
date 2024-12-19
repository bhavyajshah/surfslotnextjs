'use client';

import { Location } from '@/hooks/use-locations/types';
import { Select } from '@/components/ui/select';

interface LocationDropdownProps {
    locations: Location[];
    onChange: (locationId: string) => void;
}

export function LocationDropdown({ locations, onChange }: LocationDropdownProps) {
    return (
        <Select
            options={locations.map(loc => ({
                label: `${loc.name}, ${loc.city}`,
                value: loc.id
            }))}
            onChange={onChange}
            placeholder="Select a surf location"
        />
    );
}