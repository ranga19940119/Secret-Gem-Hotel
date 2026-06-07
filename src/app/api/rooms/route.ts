import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { roomNumber: 'asc' },
      include: {
        reservations: {
          where: {
            status: { in: ['CHECKED_IN', 'CONFIRMED'] },
            checkIn: { lte: new Date() },
            checkOut: { gt: new Date() }
          }
        }
      }
    });
    
    // Map status if currently occupied by a reservation
    const formattedRooms = rooms.map(room => {
      const activeReservation = room.reservations[0];
      return {
        ...room,
        status: activeReservation ? 'OCCUPIED' : room.status,
        guest: activeReservation ? activeReservation.guestName : null
      };
    });

    return NextResponse.json(formattedRooms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRoom = await prisma.room.create({
      data: {
        roomNumber: body.roomNumber,
        type: body.type,
        pricePerNight: body.pricePerNight,
        description: body.description,
        features: body.features,
        floorId: body.floorId || null,
      }
    });
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
