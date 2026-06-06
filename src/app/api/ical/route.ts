import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This is a simplified iCal generator for syncing with Booking.com, Agoda, Airbnb, etc.
// In a real production scenario, you would parse incoming .ics URLs from those OTAs as well.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  try {
    const whereClause = roomId ? { roomId } : {};
    
    // Fetch all confirmed or checked-in reservations
    const reservations = await prisma.reservation.findMany({
      where: {
        ...whereClause,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] }
      },
      include: { room: true }
    });

    // Generate iCal format string
    let icalStr = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Secret Gem Hotel//Reservation System//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n`;

    reservations.forEach(res => {
      // Format dates to iCal standard (YYYYMMDD)
      const checkInStr = res.checkIn.toISOString().replace(/[-:]/g, '').split('T')[0];
      const checkOutStr = res.checkOut.toISOString().replace(/[-:]/g, '').split('T')[0];
      const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      icalStr += `BEGIN:VEVENT\r\n`;
      icalStr += `DTSTART;VALUE=DATE:${checkInStr}\r\n`;
      icalStr += `DTEND;VALUE=DATE:${checkOutStr}\r\n`;
      icalStr += `DTSTAMP:${dtStamp}\r\n`;
      icalStr += `UID:res-${res.id}@secretgemhotel.com\r\n`;
      icalStr += `SUMMARY:Reserved - Room ${res.room.roomNumber}\r\n`;
      icalStr += `DESCRIPTION:Reservation from ${res.source}\r\n`;
      icalStr += `END:VEVENT\r\n`;
    });

    icalStr += `END:VCALENDAR`;

    return new NextResponse(icalStr, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="calendar${roomId ? `-${roomId}` : ''}.ics"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
