import { useSession } from 'next-auth/react';

export function useGoogleCalendar() {
  const { data: session } = useSession();

  const createSurfEvent = async (slot: {
    date: string;
    location: string;
    spot: string;
    conditions: {
      waveHeight: string;
      wind: string;
      tide: string;
    };
  }) => {
    if (!session?.accessToken) {
      throw new Error('No access token available');
    }

    const startTime = new Date(slot.date);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

    const event = {
      summary: `Surf Session at ${slot.spot}`,
      description: `Location: ${slot.location}\nConditions:\n- Wave Height: ${slot.conditions.waveHeight}\n- Wind: ${slot.conditions.wind}\n- Tide: ${slot.conditions.tide}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    return response.json();
  };

  return {
    createSurfEvent,
    isAuthenticated: !!session?.accessToken,
  };
}