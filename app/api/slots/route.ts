import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id ?? null;
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user slots
    const userSlots = await prisma.userSlot.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        summary: true,
        description: true,
        start: true,
        end: true,
        userId: true
      }
    });

    // No need to format dates since they're already stored as ISO strings
    return NextResponse.json(userSlots);

  } catch (error) {
    console.error('Error in /api/slots:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch user slots',
          message: error.message,
          type: error.name
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

