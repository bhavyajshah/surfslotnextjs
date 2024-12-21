import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string; spotId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { active } = await request.json();
    const spot = await prisma.spot.update({
      where: {
        id: params.spotId,
        locationId: params.locationId
      },
      data: { active }
    });

    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error updating spot:', error);
    return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 });
  }
}