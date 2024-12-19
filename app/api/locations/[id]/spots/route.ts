import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const spot = await prisma.spot.create({
      data: {
        ...data,
        locationId: params.id
      }
    });
    return NextResponse.json(spot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create spot' }, { status: 500 });
  }
}