import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const locations = await prisma.locationWithSpots.findMany({
      include: {
        userLocations: {
          select: {
            enabled: true,
            spots: true,
            userId: true
          }
        }
      }
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}