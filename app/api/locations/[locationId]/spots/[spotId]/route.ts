import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { locations } from '@/lib/data/location';

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string; spotId: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { active } = await request.json();
    const location = locations.find(loc => loc._id === params.locationId);
    const spot = location?.spots.find(s => s.id === params.spotId);

    if (!location || !spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Return the updated spot
    return NextResponse.json({
      id: spot.id,
      name: spot.name,
      active
    });
  } catch (error) {
    console.error('Error updating spot:', error);
    return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 });
  }
}