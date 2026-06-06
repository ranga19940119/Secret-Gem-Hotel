import React from 'react';
import styles from './console.module.css';
import prisma from '@/lib/prisma';
import AddReservationForm from '@/components/AddReservationForm';

export const dynamic = 'force-dynamic';

// Define the Room type for our component
type RoomWithGuest = {
  id: string;
  roomNumber: string;
  type: string;
  status: string;
  guest?: string | null;
};

// Next.js App Router Server Component
export default async function AdminConsole() {
  // Fetch real data from SQLite database
  let roomsData: any[] = [];
  try {
    roomsData = await prisma.room.findMany({
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
    return {
      ...room,
      status: activeRes ? 'OCCUPIED' : room.status,
      guest: activeRes ? activeRes.guestName : null
    };
  });

  return (
    <div className={styles.consoleContainer}>
      <aside className={styles.leftSidebar}>
        <div style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', marginBottom: '10px' }}>
          All Floors
        </div>
        <div style={{ padding: '10px', cursor: 'pointer' }}>1st Floor</div>
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
              <div>
                <div className={styles.roomHeader}>
                  <span className={styles.roomNumber}>{room.roomNumber}</span>
                </div>
                <div className={styles.roomType}>{room.type}</div>
                {room.guest && <div style={{ marginTop: '5px', fontSize: '14px' }}>{room.guest}</div>}
              </div>
            </div>
          );
        })}
        <div className={styles.roomCard} style={{ justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' }}>
          + Create a room
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
