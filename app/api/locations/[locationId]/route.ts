import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const { active } = await request.json()
    // In a real app, update the location in the database
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    // In a real app, delete the location from the database
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}