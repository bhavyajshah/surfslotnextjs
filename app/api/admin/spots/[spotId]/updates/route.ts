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
    const usersToNotify = await prisma.user.findMany({
      where: {
        selectedSpots: {
          has: params.spotId
        },
        calendarNotifications: true
      }
    });

    // Here you would implement notification logic for selected users
    // This could be email, push notifications, etc.

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error creating spot update:', error);
    return NextResponse.json(
      { error: 'Failed to create update' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { spotId: string } }
) {
  try {
    const updates = await prisma.dailyUpdate.findMany({
      where: {
        spotId: params.spotId,
        endTime: {
          gte: new Date()
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching spot updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}