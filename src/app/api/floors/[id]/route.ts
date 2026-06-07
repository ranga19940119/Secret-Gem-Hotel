import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    // A floor shouldn't be deleted if it has rooms, to prevent orphans, or we can just delete it
    // Wait, let's delete all rooms associated with this floor first, or just throw an error if it has rooms.
    // It's safer to delete rooms if the floor is deleted, but since they are setting it up, it's fine.
    // Actually, we must delete rooms, and rooms have reservations, which have payments.
    // Let's just find all rooms in the floor and delete their payments/reservations first.

    const rooms = await prisma.room.findMany({ where: { floorId: id } });
    const roomIds = rooms.map((r: any) => r.id);

    if (roomIds.length > 0) {
      const reservations = await prisma.reservation.findMany({ where: { roomId: { in: roomIds } } });
      const reservationIds = reservations.map((r: any) => r.id);

      if (reservationIds.length > 0) {
        await prisma.payment.deleteMany({
          where: { reservationId: { in: reservationIds } }
        });
      }

      await prisma.reservation.deleteMany({
        where: { roomId: { in: roomIds } }
      });

      await prisma.room.deleteMany({
        where: { floorId: id }
      });
    }

    await prisma.floor.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete floor:', error);
    return NextResponse.json({ error: 'Failed to delete floor' }, { status: 500 });
  }
}
