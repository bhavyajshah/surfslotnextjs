  import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/utils/auth-checks';

export async function POST(
  request: Request,
  { params }: { params: { spotId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, startTime, endTime } = await request.json();

    const update = await prisma.dailyUpdate.create({
      data: {
        spotId: params.spotId,
        message,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    });

    // Notify users who have selected this spot
    const spot = await prisma.spot.findUnique({
      where: { id: params.spotId },
      include: { location: true }
    });

    const usersToNotify = await prisma.user.findMany({
      where: {
        selectedSpots: {
          has: params.spotId
        },
        calendarNotifications: true
      }
    });

    // Create calendar events for each user
    for (const user of usersToNotify) {
      // Here you would implement the Google Calendar event creation
      // This will be handled by a separate service/webhook
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error creating spot update:', error);
    return NextResponse.json(
      { error: 'Failed to create update' },
      { status: 500 }
    );
  }
}