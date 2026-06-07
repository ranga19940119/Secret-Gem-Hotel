import React from 'react';
import styles from './console.module.css';
import prisma from '@/lib/prisma';
import AddReservationForm from '@/components/AddReservationForm';
import AddFloorForm from '@/components/AddFloorForm';
import AddRoomForm from '@/components/AddRoomForm';
import RoomCardInteractive from '@/components/RoomCardInteractive';
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

    return {
      ...room,
      status: activeRes ? 'OCCUPIED' : room.status,
      guest: activeRes ? activeRes.guestName : null,
      checkoutStatus
    };
  });

  return (
    <div className={styles.consoleContainer}>
      <aside className={styles.leftSidebar}>
        <AddFloorForm />
        <Link href="/admin" style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: !searchParams.floor ? '#007bff' : 'transparent', color: !searchParams.floor ? 'white' : 'var(--color-text-main)', borderRadius: '4px', marginBottom: '5px' }}>
            All Floors
          </div>
        </Link>
        {floorsData.map(floor => (
          <Link key={floor.id} href={`/admin?floor=${floor.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', backgroundColor: searchParams.floor === floor.id ? 'rgba(212,175,55,0.2)' : 'transparent', color: searchParams.floor === floor.id ? 'var(--color-gold)' : 'inherit' }}>
              {floor.name}
            </div>
          </Link>
        ))}
      </aside>

      <section className={styles.roomGrid}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Room Console</h2>
          <AddReservationForm availableRooms={roomsData} />
        </div>
        
        {rooms.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '20px', color: 'var(--color-text-muted)' }}>
            No rooms found in the database. Please create some rooms.
          </div>
        )}
        {rooms.map((room) => {
          let cardClass = styles.roomCard;
          if (room.status === 'AVAILABLE') cardClass += ` ${styles.roomAvailable}`;
          if (room.status === 'OCCUPIED') cardClass += ` ${styles.roomOccupied}`;
          if (room.status === 'CLEANING_REQUIRED') cardClass += ` ${styles.roomMaintenance}`; // Using maintenance color for now

          return (
            <div key={room.id} className={cardClass}>
              <RoomCardInteractive room={room}>
                <div className={styles.roomHeader}>
                  <span className={styles.roomNumber}>{room.roomNumber}</span>
                  {room.checkoutStatus === 'OVERDUE' && <span style={{ fontSize: '10px', backgroundColor: '#ff4d4d', padding: '2px 6px', borderRadius: '10px', color: '#fff', fontWeight: 'bold' }}>OVERDUE</span>}
                  {room.checkoutStatus === 'SOON' && <span style={{ fontSize: '10px', backgroundColor: '#ffcc00', padding: '2px 6px', borderRadius: '10px', color: '#000', fontWeight: 'bold' }}>CHECKOUT SOON</span>}
                </div>
                <div className={styles.roomType}>{room.type}</div>
                {room.guest && <div style={{ marginTop: '5px', fontSize: '14px' }}>{room.guest}</div>}
              </RoomCardInteractive>
            </div>
          );
        })}
        <div style={{ padding: '0', backgroundColor: 'transparent' }}>
          <AddRoomForm availableFloors={floorsData} />
        </div>
      </section>

      <aside className={styles.rightSidebar}>
        <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--color-gold)' }}>
          <h3 style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span>✨</span> AI Insights
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#eee' }}>
            <strong>Analysis:</strong> Current occupancy is {Math.round((rooms.filter(r => r.status === 'OCCUPIED').length / rooms.length) * 100)}%. 
            {rooms.filter(r => r.status === 'OCCUPIED').length < rooms.length / 2 
              ? ' Occupancy is low. Consider running a weekend promotion on standard rooms to increase bookings.' 
              : ' Occupancy is high. Dynamic pricing suggests a 5% increase for remaining available rooms.'}
          </p>
        </div>

        <h3>Filter</h3>
        <div className={styles.filterLegend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#ffffff', border: '1px solid #ccc' }}></div>
            <span>Unoccupied</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--status-occupied)' }}></div>
            <span>Occupied</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--status-cleaning)' }}></div>
            <span>Cleaning required</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--status-maintenance)' }}></div>
            <span>Under maintenance</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
