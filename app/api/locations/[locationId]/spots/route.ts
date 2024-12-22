import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userLocation = await prisma.userLocation.findFirst({
      where: {
        locationId: params.locationId,
        userId: session.user.id,
      },
    });

    if (!userLocation) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    await prisma.userLocation.delete({
      where: { id: userLocation.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string } }
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
    });

    if (!userLocation) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const updatedLocation = await prisma.userLocation.update({
      where: { id: userLocation.id },
      data: { enabled },
      include: { spots: true },
    });

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}