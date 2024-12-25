import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    const userLocation = await prisma.userLocation.update({
      where: {
        userId_locationId: {
          userId: session.user.id,
          locationId: params.locationId
        }
      },
      data: {
        enabled
      }
    });

    return NextResponse.json(userLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.userLocation.delete({
      where: {
        userId_locationId: {
          userId: session.user.id,
          locationId: params.locationId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user location:', error);
    return NextResponse.json(
      { error: 'Failed to delete user location' },
      { status: 500 }
    );
  }
}