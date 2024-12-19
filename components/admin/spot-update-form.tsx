'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TimePickerInput } from '../ui/time-picker';

interface SpotUpdateFormProps {
    spotId: string;
    spotName: string;
    onSubmit: () => void;
}

export function SpotUpdateForm({ spotId, spotName, onSubmit }: SpotUpdateFormProps) {
    const [message, setMessage] = useState('');
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startTime || !endTime) {
            toast({
                title: 'Error',
                description: 'Please select both start and end times',
                variant: 'destructive'
            });
            return;
        }

        try {
            const response = await fetch(`/api/admin/spots/${spotId}/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString()
                })
            });

            if (!response.ok) throw new Error('Failed to create update');

            toast({
                title: 'Success',
                description: 'Spot update created successfully'
            });

            setMessage('');
            setStartTime(null);
            setEndTime(null);
            onSubmit();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create spot update',
                variant: 'destructive'
            });
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Update {spotName}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Conditions Message</label>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g., Good conditions expected"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <TimePickerInput
                            value={startTime}
                            onChange={setStartTime}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <TimePickerInput
                            value={endTime}
                            onChange={setEndTime}
                            className="w-full"
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Create Update
                </Button>
            </form>
        </Card>
    );
}