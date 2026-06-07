'use client';

import React, { useState } from 'react';

export default function AddFloorForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, level })
      });
      if (res.ok) {
        setIsOpen(false);
        window.location.reload();
      } else {
        alert('Failed to create floor');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '8px 15px', backgroundColor: '#333', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px', width: '100%' }}
      >
        + Add Floor
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--color-bg-panel)', padding: '30px', borderRadius: '8px', width: '300px', border: '1px solid var(--color-gold)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--color-gold)' }}>Create New Floor</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Floor Name (e.g., 1st Floor)" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px' }} />
              <input type="number" placeholder="Level (e.g., 1)" value={level} onChange={e => setLevel(e.target.value)} style={{ padding: '8px' }} />
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
