import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string; spotId: string } }
) {
  try {
    const { active } = await request.json()
    // In a real app, update the spot in the database
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update spot' }, { status: 500 })
  }
}