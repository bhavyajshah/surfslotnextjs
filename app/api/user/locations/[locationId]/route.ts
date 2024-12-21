import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.userLocation.delete({
      where: {
        id: params.locationId,
        user: {
          email: session.user.email
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing location:', error);
    return NextResponse.json({ error: 'Failed to remove location' }, { status: 500 });
  }
}