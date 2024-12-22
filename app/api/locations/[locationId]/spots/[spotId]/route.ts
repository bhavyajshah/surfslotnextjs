import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string; spotId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    const userLocation = await prisma.userLocation.findFirst({
      where: {
        locationId: params.locationId,
        userId: session.user.id,
      },
      include: {
        spots: true,
      },
    });

    if (!userLocation) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const spot = userLocation.spots.find(s => s.spotId === params.spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    await prisma.userSpot.update({
      where: { id: spot.id },
      data: { enabled },
    });

    const updatedLocation = await prisma.userLocation.findUnique({
      where: { id: userLocation.id },
      include: { spots: true },
    });

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error('Error updating spot:', error);
    return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 });
  }
}