import { Session } from 'next-auth';

interface SurfConditions {
  waveHeight: string;
  wind: string;
  tide: string;
  bestTimeToSurf?: string[];
}

interface SurfEvent {
  spot: string;
  location: string;
  conditions: SurfConditions;
  startTime: Date;
  endTime: Date;
}

export async function createSurfEvent(session: Session | null, event: SurfEvent) {
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const description = `
🏄‍♂️ Surf Session Details:
Location: ${event.location}
Spot: ${event.spot}

Conditions:
- Wave Height: ${event.conditions.waveHeight}
- Wind: ${event.conditions.wind}
- Tide: ${event.conditions.tide}
${event.conditions.bestTimeToSurf ? `\nBest Time to Surf: ${event.conditions.bestTimeToSurf.join(', ')}` : ''}
  `.trim();

  const calendarEvent = {
    summary: `Surf Session at ${event.spot}`,
    description,
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    colorId: "7", // Aqua color for surf events
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'email', minutes: 120 }
      ]
    }
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create calendar event');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}