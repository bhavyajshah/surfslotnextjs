import crypto from 'crypto';

export async function createUserCalendar(accessToken: string, userEmail: string) {
  try {
    // Create a unique calendar ID using hash
    const hash = crypto
      .createHash('sha256')
      .update(`${userEmail}-${Date.now()}`)
      .digest('hex');

    const calendarId = `${hash}@group.calendar.google.com`;

    // Create a new calendar in Google Calendar
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: 'Surfslot Calendar',
        timeZone: 'UTC',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create calendar:', errorData);
      throw new Error('Failed to create calendar');
    }

    const calendarData = await response.json();
    return calendarData.id; // Return the actual calendar ID provided by Google

  } catch (error) {
    console.error('Error creating calendar:', error);
    throw error;
  }
}