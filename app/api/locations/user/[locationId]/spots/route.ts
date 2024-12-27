import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { locationId } = params;
    const { spots } = await request.json();

    if (!spots || !Array.isArray(spots)) {
      return NextResponse.json({ error: 'Invalid spots data' }, { status: 400 });
    }

    const updatedLocation = await prisma.userLocation.update({
      where: {
        id: locationId,
        userId: session.user.id,
      },
      data: {
        spots: spots,
      },
    });

    if (!updatedLocation) {
      return NextResponse.json({ error: 'User location not found' }, { status: 404 });
    }

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error('Error updating user location spots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}