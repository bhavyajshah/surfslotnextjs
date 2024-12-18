import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        spots: {
          select: {
            id: true,
            name: true,
            active: true,
            conditions: true
          }
        }
      }
    });
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    const data = await request.json();

    const location = await prisma.location.create({
      data: {
        name: data.name,
        city: data.city,
        active: false,
        spots: {
          create: data.spots || []
        }
      },
      include: {
        spots: true
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}