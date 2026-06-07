import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    // Find all reservations for this room to delete their payments
    const reservations = await prisma.reservation.findMany({ where: { roomId: id } });
    const reservationIds = reservations.map((r: any) => r.id);

    // Delete associated payments first
    if (reservationIds.length > 0) {
      await prisma.payment.deleteMany({
        where: { reservationId: { in: reservationIds } }
      });
    }

    // Delete associated reservations
    await prisma.reservation.deleteMany({
      where: { roomId: id }
    });

    // Delete the room
    await prisma.room.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
