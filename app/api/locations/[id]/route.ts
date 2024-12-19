import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const location = await prisma.location.findUnique({
      where: { id: params.id },
      include: {
        spots: true
      }
    });

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    const data = await request.json();

    const location = await prisma.location.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        spots: true
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    await prisma.location.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}