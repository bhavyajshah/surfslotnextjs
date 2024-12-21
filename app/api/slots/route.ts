import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const slots = [
      {
        id: '1',
        date: 'Wed 12th November',
        startTime: '12:00',
        endTime: '14:00',
        location: 'Reef',
        spot: 'Coxos',
        conditions: 'Good surf conditions'
      },
      {
        id: '2',
        date: 'Wed 12th November',
        startTime: '12:00',
        endTime: '14:00',
        location: 'Reef',
        spot: 'Coxos',
        conditions: 'Good surf conditions'
      },
      {
        id: '3',
        date: 'Wed 12th November',
        startTime: '12:00',
        endTime: '14:00',
        location: 'Reef',
        spot: 'Coxos',
        conditions: 'Good surf conditions'
      }
    ];

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching surf slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surf slots' },
      { status: 500 }
    );
  }
}