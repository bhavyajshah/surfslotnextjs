import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Mock data for now - replace with actual DB query
    const locations = [
      {
        id: "1",
        name: "Ericeira",
        active: true,
        spots: [
          { id: "1", name: "Ribeira d'Ilhas", active: true },
          { id: "2", name: "Coxos", active: false },
          { id: "3", name: "São Lourenço", active: true },
        ],
      },
      {
        id: "2",
        name: "Peniche",
        active: false,
        comingSoon: true,
        spots: [],
      },
      {
        id: "3",
        name: "Carcavelos",
        active: false,
        comingSoon: true,
        spots: [],
      },
    ];

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}