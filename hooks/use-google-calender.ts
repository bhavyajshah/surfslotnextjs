import { createCalendarEvent } from '@/lib/google-calender';
import { useSession } from 'next-auth/react';

export function useGoogleCalendar() {
  const { data: session } = useSession();

  const createSurfEvent = async (
    startTime: Date,
    endTime: Date,
    location: string,
    description: string
  ) => {
    try {
      const event = {
        summary: `Surf Session at ${location}`,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      return await createCalendarEvent(session, event);
    } catch (error) {
      console.error('Error creating surf event:', error);
      throw error;
    }
  };

  return {
    createSurfEvent,
    isAuthenticated: !!session?.accessToken,
  };
}