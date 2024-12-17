import { Session } from 'next-auth';

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export async function createCalendarEvent(session: Session | null, event: CalendarEvent) {
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}