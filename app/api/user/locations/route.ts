import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { locationId, spotIds } = await request.json();

    // Update user's selected spots
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        selectedSpots: spotIds,
        calendarNotifications: true
      },
      create: {
        email: session.user.email,
        name: session.user.name || '',
        selectedSpots: spotIds,
        calendarNotifications: true
      }
    });

    // Activate the location
    await prisma.location.update({
      where: { id: locationId },
      data: { active: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user locations:', error);
    return NextResponse.json(
      { error: 'Failed to update locations' },
      { status: 500 }
    );
  }
}