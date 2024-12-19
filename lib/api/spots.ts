import { prisma } from '@/lib/prisma';

export async function createSpot(locationId: string, data: {
  name: string;
  active?: boolean;
  conditions?: {
    waveHeight?: string;
    wind?: string;
    tide?: string;
    bestTimeToSurf?: string[];
  };
}) {
  return prisma.spot.create({
    data: {
      ...data,
      location: {
        connect: { id: locationId }
      }
    }
  });
}

export async function updateSpot(id: string, data: {
  active?: boolean;
  conditions?: {
    waveHeight?: string;
    wind?: string;
    tide?: string;
    bestTimeToSurf?: string[];
  };
}) {
  return prisma.spot.update({
    where: { id },
    data
  });
}

export async function deleteSpot(id: string) {
  return prisma.spot.delete({
    where: { id }
  });
}