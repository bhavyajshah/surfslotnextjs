import { prisma } from '@/lib/prisma';
import { Location } from '@/hooks/use-locations/types';

export async function getLocations() {
  try {
    return await prisma.location.findMany({
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
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
}

export async function createLocation(data: Partial<Location>) {
  try {
    return await prisma.location.create({
      data: {
        name: data.name!,
        city: data.city!,
        active: false,
        spots: {
          create: data.spots?.map(spot => ({
            name: spot.name!,
            active: false,
            conditions: spot.conditions || {
              waveHeight: 'medium',
              wind: 'offshore',
              tide: 'mid',
              bestTimeToSurf: ['morning', 'evening']
            }
          })) || []
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

export async function updateLocation(id: string, data: Partial<Location>) {
  try {
    return await prisma.location.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        spots: true
      }
    });
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error('Failed to update location');
  }
}

export async function deleteLocation(id: string) {
  try {
    await prisma.location.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    throw new Error('Failed to delete location');
  }
}