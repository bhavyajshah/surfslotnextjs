import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string; spotId: string } }
) {
  try {
    const { active } = await request.json();
    const spot = await prisma.spot.update({
      where: { id: params.spotId },
      data: { active }
    });
    return NextResponse.json(spot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 });
  }
}