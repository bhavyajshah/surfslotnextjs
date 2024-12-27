import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete using the location's ID directly
    await prisma.userLocation.delete({
      where: {
        id: params.locationId,
        userId: session.user.id, 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user location:', error);
    return NextResponse.json(
      { error: 'Failed to delete user location' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

