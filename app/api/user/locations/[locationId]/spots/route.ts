  import { NextResponse } from 'next/server';
  import { getServerSession } from 'next-auth';
  import { authConfig } from '@/lib/auth/config';
  import { prisma } from '@/lib/prisma';

  // Update spot status for a user location
  export async function PUT(
    request: Request,
    { params }: { params: { locationId: string } }
  ) {
    try {
      const session = await getServerSession(authConfig);
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { spotId, enabled } = await request.json();

      const userLocation = await prisma.userLocation.findFirst({
        where: {
          id: params.locationId,
          user: {
            email: session.user.email
          }
        }
      });

      if (!userLocation) {
        return NextResponse.json({ error: 'User location not found' }, { status: 404 });
      }

      // Update or create UserSpot
      const userSpot = await prisma.userSpot.upsert({
        where: {
          userLocationId_spotId: {
            userLocationId: userLocation.id,
            spotId
          }
        },
        update: {
          enabled
        },
        create: {
          userLocationId: userLocation.id,
          spotId,
          enabled
        }
      });

      return NextResponse.json(userSpot);
    } catch (error) {
      console.error('Error updating spot:', error);
      return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 });
    }
  }