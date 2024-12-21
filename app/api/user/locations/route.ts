import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

// Get user locations
export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userLocations = await prisma.userLocation.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        spots: {
          include: {
            spot: true
          }
        }
      }
    });

    return NextResponse.json(userLocations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    return NextResponse.json({ error: 'Failed to fetch user locations' }, { status: 500 });
  }
}

// Add new location for user
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { locationId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create UserLocation with associated spots
    const userLocation = await prisma.userLocation.create({
      data: {
        userId: user.id,
        locationId,
        enabled: true,
        spots: {
          create: [] // Spots will be enabled individually later
        }
      },
      include: {
        spots: true
      }
    });

    return NextResponse.json(userLocation);
  } catch (error) {
    console.error('Error adding location:', error);
    return NextResponse.json({ error: 'Failed to add location' }, { status: 500 });
  }
}