import { prisma } from '@/lib/prisma';

export async function getLocations() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        spots: {
          select: {
            id: true,
            name: true,
            active: true,
            conditions: true
          }
        }
      }
    });
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
}

export async function createLocation(data: {
  name: string;
  city: string;
  spots?: { name: string; active?: boolean; conditions?: any }[];
}) {
  try {
    return await prisma.location.create({
      data: {
        name: data.name,
        city: data.city,
        active: false,
        spots: {
          create: data.spots?.map(spot => ({
            name: spot.name,
            active: spot.active ?? false,
            conditions: spot.conditions ?? {
              waveHeight: 'medium',
              wind: 'offshore',
              tide: 'mid',
              bestTimeToSurf: ['morning', 'evening']
            }
          })) ?? []
        }
      },
      include: {
        spots: true
      }
    });
  } catch (error) {
    console.error('Error creating location:', error);
    throw new Error('Failed to create location');
  }
}