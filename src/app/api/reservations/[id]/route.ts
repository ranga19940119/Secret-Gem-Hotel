import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await request.json();
    const { id: reservationId } = await params;

    if (!['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status }
    });

    // Also update the room status based on reservation
    let roomStatus = 'AVAILABLE';
    if (status === 'CHECKED_IN' || status === 'CONFIRMED') {
      roomStatus = 'OCCUPIED';
    } else if (status === 'CHECKED_OUT') {
      roomStatus = 'CLEANING_REQUIRED';
    }

    await prisma.room.update({
      where: { id: updatedReservation.roomId },
      data: { status: roomStatus }
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
