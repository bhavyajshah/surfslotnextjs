import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSlots = await prisma.userSlot.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        start: 'asc'
      }
    });

    return NextResponse.json(userSlots);
  } catch (error) {
    console.error('Error fetching user slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surf slots' },
      { status: 500 }
    );
  }
}