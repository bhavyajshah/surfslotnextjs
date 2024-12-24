import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

// Initialize Prisma client outside of the handler to prevent multiple instances
const prisma = new PrismaClient();

export async function GET(request: Request) {
  console.log('Entering GET function for /api/slots');
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');
    console.log('Received userId from query:', userId);

    // If userId is not in the query, try to get it from the session
    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id ?? null;
      console.log('Retrieved userId from session:', userId);
    }

    if (!userId) {
      console.log('No userId provided in query or found in session');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to fetch userSlots from database with userId:', userId);

    // Use Prisma's standard query syntax
    const userSlots = await prisma.userSpot.findMany({
      where: {
        id: userId
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

    console.log('Retrieved slots:', JSON.stringify(userSlots, null, 2));

    return NextResponse.json(userSlots);

  } catch (error) {
    console.error('Error in /api/slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user slots' },
      { status: 500 }
    );
  }
}