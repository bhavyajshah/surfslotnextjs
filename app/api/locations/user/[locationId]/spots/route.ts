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

    console.log(params.locationId, spots);
    const userLocation = await prisma.userLocation.update({
      where: {
        userId_locationId: {
          userId: session.user.id,
          locationId: params.locationId
        }
      },
      data: {
        spots: spots
      }
    });

    return NextResponse.json(userLocation);
  } catch (error) {
    console.error('Error updating spots:', error);
    return NextResponse.json(
      { error: 'Failed to update spots' },
      { status: 500 }
    );
  }
}