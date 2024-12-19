import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { createLocation, getLocations } from '@/lib/api/locations';
import { isAdmin } from '@/lib/auth/utils/auth-checks';

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const location = await createLocation(data);
    return NextResponse.json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}