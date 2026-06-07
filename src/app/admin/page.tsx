import React from 'react';
import styles from './console.module.css';
import prisma from '@/lib/prisma';
import AddReservationForm from '@/components/AddReservationForm';
import AddFloorForm from '@/components/AddFloorForm';
import AddRoomForm from '@/components/AddRoomForm';
import RoomCardInteractive from '@/components/RoomCardInteractive';
import TTRoomGrid from '@/components/TTRoomGrid';
import DeleteFloorButton from '@/components/DeleteFloorButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Define the Room type for our component
type RoomWithGuest = {
  id: string;
  roomNumber: string;
  type: string;
  status: string;
  guest?: string | null;
  checkoutStatus?: 'SOON' | 'OVERDUE' | null;
};

// Next.js App Router Server Component
export default async function AdminConsole({ searchParams }: { searchParams: { floor?: string } }) {
  // Fetch real data from SQLite database
  let roomsData: any[] = [];
  let floorsData: any[] = [];
  try {
    floorsData = await prisma.floor.findMany({ orderBy: { level: 'asc' } });
    
    // Filter by floor if selected in URL
    const whereClause = searchParams.floor ? { floorId: searchParams.floor } : {};

    roomsData = await prisma.room.findMany({
      where: whereClause,
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
  } catch (error) {
    // Fallback for Vercel Serverless environment where local SQLite gets wiped
    console.error("Database connection failed on Vercel. Using fallback data.");
    roomsData = [
      { id: '1', roomNumber: '100', type: 'Standard', status: 'AVAILABLE', reservations: [] },
      { id: '2', roomNumber: '104', type: 'Deluxe Suite', status: 'OCCUPIED', reservations: [{ guestName: 'Fallback Guest' }] },
      { id: '3', roomNumber: '106', type: 'Presidential Gem', status: 'AVAILABLE', reservations: [] },
    ];
  }

  // Calculate status
  const rooms: RoomWithGuest[] = roomsData.map(room => {
    const activeRes = room.reservations[0];
    let checkoutStatus: 'SOON' | 'OVERDUE' | null = null;
    
    if (activeRes) {
      const now = new Date();
      const checkoutDate = new Date(activeRes.checkOut);
      const hoursUntilCheckout = (checkoutDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilCheckout < 0) {
        checkoutStatus = 'OVERDUE';
      } else if (hoursUntilCheckout <= 24) {
        checkoutStatus = 'SOON';
      }
    }

    let currentStatus = room.status;
    let guestName = null;

    if (activeRes) {
      guestName = activeRes.guestName;
      if (activeRes.status === 'CHECKED_IN') {
        currentStatus = 'OCCUPIED';
      } else if (activeRes.status === 'CONFIRMED') {
        currentStatus = 'RESERVED';
      } else if (activeRes.status === 'CHECKED_OUT') {
        currentStatus = 'CLEANING_REQUIRED';
      }
    }

    return {
      ...room,
      status: currentStatus,
      guest: guestName,
      checkoutStatus
    };
  });

  return (
    <div className={styles.consoleContainer}>
      <aside className={styles.leftSidebar}>
        <AddFloorForm />
        
        <Link href="/admin/finance" style={{ display: 'block', textDecoration: 'none', marginBottom: '15px' }}>
          <div style={{ padding: '12px', backgroundColor: '#059669', color: 'white', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
            💰 Finance Dashboard
          </div>
        </Link>

        <a href="/admin" style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: !searchParams.floor ? '#007bff' : 'transparent', color: !searchParams.floor ? 'white' : 'var(--color-text-main)', borderRadius: '4px', marginBottom: '5px' }}>
            All Floors
          </div>
        </a>
        {floorsData.map(floor => (
          <a key={floor.id} href={`/admin?floor=${floor.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', backgroundColor: searchParams.floor === floor.id ? 'rgba(212,175,55,0.2)' : 'transparent', color: searchParams.floor === floor.id ? 'var(--color-gold)' : 'inherit' }}>
              <span>{floor.name}</span>
              <DeleteFloorButton floorId={floor.id} />
            </div>
          </a>
        ))}
      </aside>

      <TTRoomGrid initialRooms={rooms} floorsData={floorsData} />
    </div>
  );
}
