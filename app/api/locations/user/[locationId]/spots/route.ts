import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spots } = await request.json();

    console.log('Updating spots for location:', params.locationId);
    console.log('User ID:', session.user.id);
    console.log('Spots data:', JSON.stringify(spots, null, 2));

    const userLocation = await prisma.userLocation.findFirst({
      where: {
        userId: session.user.id,
        locationId: params.locationId
      },
    });

    if (!userLocation) {
      console.error('User location not found for:', { userId: session.user.id, locationId: params.locationId });
      return NextResponse.json({ error: 'User location not found' }, { status: 404 });
    }

    const updatedUserLocation = await prisma.userLocation.update({
      where: {
        id: userLocation.id,
      },
      data: {
        spots: spots,
      },
    });

    console.log('Updated user location:', JSON.stringify(updatedUserLocation, null, 2));

    return NextResponse.json(updatedUserLocation);
  } catch (error) {
    console.error('Error updating spots:', error);
    return NextResponse.json(
      { error: 'Failed to update spots', details: error.message },
      { status: 500 }
    );
  }
}
