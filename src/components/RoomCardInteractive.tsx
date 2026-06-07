'use client';

import React, { useState } from 'react';

export default function RoomCardInteractive({ room, children }: { room: any, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeRes = room.reservations?.[0];

  const handleStatusChange = async (newStatus: string) => {
    if (!activeRes) return;
    
    try {
      const res = await fetch(`/api/reservations/${activeRes.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setIsOpen(false);
        window.location.reload();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} style={{ height: '100%' }}>
        {children}
      </div>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, textAlign: 'left' }}>
          <div style={{ backgroundColor: 'var(--color-bg-panel)', padding: '30px', borderRadius: '8px', width: '350px', border: '1px solid var(--color-gold)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--color-gold)' }}>Room {room.roomNumber} - {room.type}</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Status:</strong> {room.status}</p>
              {activeRes ? (
                <>
                  <p><strong>Guest:</strong> {activeRes.guestName}</p>
                  <p><strong>Reservation:</strong> {activeRes.status}</p>
                  <p><strong>Check In:</strong> {new Date(activeRes.checkIn).toLocaleDateString()}</p>
                  <p><strong>Check Out:</strong> {new Date(activeRes.checkOut).toLocaleDateString()}</p>
                </>
              ) : (
                <p style={{ color: '#888' }}>No active reservation currently.</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeRes && activeRes.status !== 'CHECKED_IN' && (
                <button onClick={() => handleStatusChange('CHECKED_IN')} style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Check In Guest
                </button>
              )}
              {activeRes && activeRes.status === 'CHECKED_IN' && (
                <button onClick={() => handleStatusChange('CHECKED_OUT')} style={{ padding: '12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Check Out Guest
                </button>
              )}
              <button onClick={() => setIsOpen(false)} style={{ padding: '12px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
