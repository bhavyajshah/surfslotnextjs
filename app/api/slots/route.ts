import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's slots
    const slots = await prisma.userSlot.findMany({
      where: {
        userId: user.id,
        startTime: {
          gte: new Date() // Only future slots
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching surf slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surf slots' },
      { status: 500 }
    );
  }
}