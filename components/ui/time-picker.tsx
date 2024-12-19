'use client';

import * as React from 'react';
import { Input } from './input';

interface TimePickerInputProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    className?: string;
}

export function TimePickerInput({ value, onChange, className }: TimePickerInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeString = e.target.value;
        if (!timeString) {
            onChange(null);
            return;
        }

        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        onChange(date);
    };

    const formatTime = (date: Date | null) => {
        if (!date) return '';
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <Input
            type="time"
            value={formatTime(value)}
            onChange={handleChange}
            className={className}
        />
    );
}