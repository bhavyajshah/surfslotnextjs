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
          }
        }
      }
    });

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
    return NextResponse.json({ error: 'Failed to fetch surf slots' }, { status: 500 });
  }
}