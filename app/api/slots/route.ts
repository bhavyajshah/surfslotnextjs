import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeLocations = await prisma.location.findMany({
      where: {
        active: true,
        spots: {
          some: {
            active: true
          }
        }
      },
      include: {
        spots: {
          where: {
            active: true
          },
          select: {
            id: true,
            name: true,
            conditions: true
          }
        }
      }
    });

    if (!activeLocations.length) {
      return NextResponse.json([]);
    }

    const currentDate = new Date();
    const slots = activeLocations.flatMap(location =>
      location.spots.map(spot => ({
        id: spot.id,
        date: currentDate.toISOString(),
        location: location.name,
        spot: spot.name,
        conditions: spot.conditions || {
          waveHeight: "Good",
          wind: "Favorable",
          tide: "Mid",
          bestTimeToSurf: ["Morning", "Evening"]
        }
      }))
    );

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching surf slots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}