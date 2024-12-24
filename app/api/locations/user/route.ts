import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/config'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { locationId, locationName, spots } = data

    const userLocation = await prisma.userLocation.create({
      data: {
        userId: session.user.id,
        locationId,
        locationName,
        enabled: true,
        spots: spots.map((spot: any) => ({
          ...spot,
          enabled: true
        }))
      }
    })

    // Transform the response to match the expected format
    const formattedResponse = {
      _id: {
        $oid: userLocation.id
      },
      userId: {
        $oid: userLocation.userId
      },
      locationId: {
        $oid: userLocation.locationId
      },
      locationName: userLocation.locationName,
      enabled: userLocation.enabled,
      spots: userLocation.spots
    }

    return NextResponse.json(formattedResponse)
  } catch (error) {
    console.error('Error creating user location:', error)
    return NextResponse.json(
      { error: 'Failed to create user location' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userLocations = await prisma.userLocation.findMany({
      where: {
        userId: session.user.id
      }
    })

    // Transform the response to match the expected format
    const formattedLocations = userLocations.map(location => ({
      _id: {
        $oid: location.id
      },
      userId: {
        $oid: location.userId
      },
      locationId: {
        $oid: location.locationId
      },
      locationName: location.locationName,
      enabled: location.enabled,
      spots: location.spots
    }))

    return NextResponse.json(formattedLocations)
  } catch (error) {
    console.error('Error fetching user locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user locations' },
      { status: 500 }
    )
  }
}