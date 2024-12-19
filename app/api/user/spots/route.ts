import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spots } = await request.json();

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { selectedSpots: spots },
      create: {
        email: session.user.email,
        name: session.user.name || '',
        selectedSpots: spots
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user spots:', error);
    return NextResponse.json(
      { error: 'Failed to update spots' },
      { status: 500 }
    );
  }
}