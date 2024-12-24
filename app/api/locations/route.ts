import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const locations = await prisma.locationWithSpots.findMany()

    // Transform the data to match the expected format
    const formattedLocations = locations.map(location => ({
      _id: {
        $oid: location.id // Changed from location._id
      },
      name: location.name,
      spots: location.spots
    }))

    return NextResponse.json(formattedLocations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}