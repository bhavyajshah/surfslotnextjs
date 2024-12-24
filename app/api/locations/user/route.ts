import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userLocations = await prisma.userLocation.findMany({
      where: {
        userId: userId,
        enabled: true
      },
      include: {
        location: true
      }
    })

    return NextResponse.json(userLocations)
  } catch (error) {
    console.error('Error fetching user locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user locations' },
      { status: 500 }
    )
  }
}