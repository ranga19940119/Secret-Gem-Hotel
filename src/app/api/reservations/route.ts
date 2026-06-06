import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if room is available for those dates
    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        roomId: body.roomId,
        status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        OR: [
          { checkIn: { lte: new Date(body.checkOut) }, checkOut: { gte: new Date(body.checkIn) } }
        ]
      }
    });

    if (conflictingReservations.length > 0) {
      return NextResponse.json({ error: 'Room is already booked for these dates' }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        totalAmount: parseFloat(body.totalAmount),
        paidAmount: parseFloat(body.paidAmount || 0),
        status: body.status || 'CONFIRMED',
        source: 'MANUAL',
        roomId: body.roomId
      }
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
