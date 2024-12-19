import { prisma } from '@/lib/prisma';

export async function getLocations() {
  return prisma.location.findMany({
    include: {
      spots: true
    }
  });
}

export async function getLocationById(id: string) {
  return prisma.location.findUnique({
    where: { id },
    include: {
      spots: true
    }
  });
}

export async function createLocation(data: {
  name: string;
  city: string;
  spots?: { name: string; active?: boolean }[];
}) {
  return prisma.location.create({
    data: {
      name: data.name,
      city: data.city,
      spots: {
        create: data.spots || []
      }
    },
    include: {
      spots: true
    }
  });
}

export async function updateLocation(id: string, data: {
  name?: string;
  city?: string;
  active?: boolean;
}) {
  return prisma.location.update({
    where: { id },
    data,
    include: {
      spots: true
    }
  });
}

export async function deleteLocation(id: string) {
  return prisma.location.delete({
    where: { id }
  });
}