'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Spot } from '@/hooks/use-locations/types';

interface SpotFormProps {
    onAdd: (spot: Partial<Spot>) => void;
}

export function SpotForm({ onAdd }: SpotFormProps) {
    const [spotData, setSpotData] = useState({
        name: '',
        conditions: {
            waveHeight: 'medium',
            wind: 'offshore',
            tide: 'mid',
            bestTimeToSurf: ['morning', 'evening']
        }
    });

    const handleAddSpot = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!spotData.name) return;

        onAdd(spotData);
        setSpotData({
            name: '',
            conditions: {
                waveHeight: 'medium',
                wind: 'offshore',
                tide: 'mid',
                bestTimeToSurf: ['morning', 'evening']
            }
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Spot Name</label>
                <Input
                    value={spotData.name}
                    onChange={e => setSpotData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter spot name"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Wave Height</label>
                    <Select
                        value={spotData.conditions.waveHeight}
                        onChange={value => setSpotData(prev => ({
                            ...prev,
                            conditions: { ...prev.conditions, waveHeight: value }
                        }))}
                        options={[
                            { label: 'Small (1-3ft)', value: 'small' },
                            { label: 'Medium (3-5ft)', value: 'medium' },
                            { label: 'Large (5-8ft)', value: 'large' },
                            { label: 'Extra Large (8ft+)', value: 'xl' }
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Wind</label>
                    <Select
                        value={spotData.conditions.wind}
                        onChange={value => setSpotData(prev => ({
                            ...prev,
                            conditions: { ...prev.conditions, wind: value }
                        }))}
                        options={[
                            { label: 'Offshore', value: 'offshore' },
                            { label: 'Onshore', value: 'onshore' },
                            { label: 'Cross-shore', value: 'cross' }
                        ]}
                    />
                </div>
            </div>

            <Button onClick={handleAddSpot} variant="outline" className="w-full">
                Add Spot
            </Button>
        </div>
    );
}