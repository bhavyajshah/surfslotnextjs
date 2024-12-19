'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  calendarNotifications: boolean;
  selectedSpots: string[];
}

export function useUser() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.email) {
      fetchUser();
    }
  }, [session]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const updateSelectedSpots = async (spots: string[]) => {
    try {
      const response = await fetch('/api/user/spots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spots })
      });

      if (!response.ok) throw new Error('Failed to update spots');

      setUser(prev => prev ? { ...prev, selectedSpots: spots } : null);
      toast({
        title: 'Success',
        description: 'Spot preferences updated'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update spot preferences',
        variant: 'destructive'
      });
    }
  };

  const toggleCalendarNotifications = async () => {
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !user?.calendarNotifications })
      });

      if (!response.ok) throw new Error('Failed to update notifications');

      setUser(prev => prev ? { ...prev, calendarNotifications: !prev.calendarNotifications } : null);
      toast({
        title: 'Success',
        description: `Calendar notifications ${user?.calendarNotifications ? 'disabled' : 'enabled'}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive'
      });
    }
  };

  return {
    user,
    updateSelectedSpots,
    toggleCalendarNotifications
  };
}