import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { locationId, locationName, spots } = data;

    const userLocation = await prisma.userLocation.create({
      data: {
        userId: session.user.id,
        locationId,
        locationName,
        enabled: true,
        spots: {
          create: spots.map((spot: any) => ({
            name: spot.name,
            id: spot.id,
            enabled: false
          }))
        }
      }
    });

    return NextResponse.json(userLocation);
  } catch (error) {
    console.error('Error creating user location:', error);
    return NextResponse.json({ error: 'Failed to create user location' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userLocations = await prisma.userLocation.findMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json(userLocations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    return NextResponse.json({ error: 'Failed to fetch user locations' }, { status: 500 });
  }
}