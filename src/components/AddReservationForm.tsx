'use client';

import React, { useState } from 'react';

export default function AddReservationForm({ availableRooms }: { availableRooms: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', roomId: '', totalAmount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Reservation successfully created!');
        setIsOpen(false);
        window.location.reload(); // Quick refresh to show new data
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create reservation');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '10px 20px', backgroundColor: 'var(--color-gold)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}
      >
        + New Manual Reservation
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--color-bg-panel)', padding: '30px', borderRadius: '8px', width: '400px', border: '1px solid var(--color-gold)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-gold)' }}>Create Reservation</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Guest Name" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} style={{ padding: '8px' }} />
              <input type="email" placeholder="Guest Email (Optional)" value={formData.guestEmail} onChange={e => setFormData({...formData, guestEmail: e.target.value})} style={{ padding: '8px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#888' }}>Check In</label>
                  <input type="date" required value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#888' }}>Check Out</label>
                  <input type="date" required value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
              </div>
              <select required value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} style={{ padding: '8px' }}>
                <option value="">Select Room...</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.id}>Room {r.roomNumber} ({r.type})</option>
                ))}
              </select>
              <input type="number" required placeholder="Total Amount ($)" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} style={{ padding: '8px' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-gold)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#444', border: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
