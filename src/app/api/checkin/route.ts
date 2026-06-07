import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        roomId: body.roomId,
        guestName: body.guestName,
        guestEmail: body.guestEmail || null,
        guestPhone: body.guestPhone || null,
        additionalGuests: body.additionalGuests ? JSON.stringify(body.additionalGuests) : null,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        status: 'CHECKED_IN',
        source: 'MANUAL',
        totalAmount: body.totalAmount || 0,
        paidAmount: body.paymentAmount || 0,
      }
    });

    // Create payment record if any payment was made
    if (body.paymentAmount > 0) {
      await prisma.payment.create({
        data: {
          reservationId: reservation.id,
          amount: parseFloat(body.paymentAmount),
          method: body.paymentMethod || 'CASH',
          description: 'Initial check-in payment',
        }
      });
    }

    // Update the room to OCCUPIED
    await prisma.room.update({
      where: { id: body.roomId },
      data: { status: 'OCCUPIED' }
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to check in guest' }, { status: 500 });
  }
}
