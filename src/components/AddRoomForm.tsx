'use client';

import React, { useState } from 'react';

export default function AddRoomForm({ availableFloors }: { availableFloors: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '', type: 'Standard', pricePerNight: '', description: '', floorId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePerNight: parseFloat(formData.pricePerNight)
        })
      });
      if (res.ok) {
        setIsOpen(false);
        window.location.reload();
      } else {
        alert('Failed to create room');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: 'transparent', border: '2px dashed var(--color-gold)', color: 'var(--color-gold)', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        + Add New Room
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, textAlign: 'left' }}>
          <div style={{ backgroundColor: 'var(--color-bg-panel)', padding: '30px', borderRadius: '8px', width: '350px', border: '1px solid var(--color-gold)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--color-gold)' }}>Create New Room</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Room Number (e.g., 201)" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} style={{ padding: '8px' }} />
              
              <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '8px' }}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential Gem">Presidential Gem</option>
              </select>

              <select value={formData.floorId} onChange={e => setFormData({...formData, floorId: e.target.value})} style={{ padding: '8px' }}>
                <option value="">No Specific Floor</option>
                {availableFloors.map(floor => (
                  <option key={floor.id} value={floor.id}>{floor.name}</option>
                ))}
              </select>

              <input type="number" required placeholder="Price Per Night ($)" value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: e.target.value})} style={{ padding: '8px' }} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-gold)', border: 'none', color: '#000', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#444', border: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
