'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function TTRoomCard({ room, onUpdate }: { room: any, onUpdate: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'guestInfo' | 'checkIn'>('none');
  const menuRef = useRef<HTMLDivElement>(null);
  
  const activeRes = room.reservations?.[0];

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = async (status: string) => {
    if (!activeRes) return;
    try {
      await fetch(`/api/reservations/${activeRes.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  // Styles based on TT Hotel design
  let bgColor = '#ffffff';
  let textColor = '#000000';
  let cornerTag = null;

  if (room.status === 'OCCUPIED') {
    bgColor = '#0078FF'; // TT Hotel Blue
    textColor = '#ffffff';
  } else if (room.status === 'CLEANING_REQUIRED') {
    bgColor = '#FFE9D2';
    textColor = '#D35400';
  } else if (room.status === 'RESERVED') {
    bgColor = '#ffffff';
    textColor = '#000000';
  } else if (room.status === 'UNDER_MAINTENANCE') {
    bgColor = '#F2DEDE';
    textColor = '#A94442';
  }

  // Corner tags
  if (room.checkoutStatus === 'SOON') {
    cornerTag = <div style={{ position: 'absolute', top: 0, right: 0, width: '30px', height: '30px', backgroundColor: '#F5A623', borderBottomLeftRadius: '30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', padding: '4px' }}><span style={{fontSize: '10px', color: '#fff'}}>⏳</span></div>;
  } else if (room.checkoutStatus === 'OVERDUE') {
    cornerTag = <div style={{ position: 'absolute', top: 0, right: 0, width: '30px', height: '30px', backgroundColor: '#E02020', borderBottomLeftRadius: '30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', padding: '4px' }}><span style={{fontSize: '10px', color: '#fff'}}>↪</span></div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Main Room Card */}
      <div 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ 
          backgroundColor: bgColor, color: textColor, borderRadius: '6px', padding: '12px', height: '110px', 
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
          cursor: 'pointer', border: '1px solid #e0e0e0', position: 'relative', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        {cornerTag}
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{room.roomNumber}</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>{room.type}</div>
          {activeRes && <div style={{ fontSize: '13px', marginTop: '4px', fontWeight: '500' }}>{activeRes.guestName}</div>}
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          {room.status === 'CLEANING_REQUIRED' && <span style={{ backgroundColor: '#fff', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>🧹</span>}
          {room.status === 'OCCUPIED' && <span style={{ backgroundColor: '#fff', padding: '2px 4px', borderRadius: '4px', fontSize: '12px', color: '#0078FF' }}>🚪</span>}
          {room.status === 'RESERVED' && <span style={{ backgroundColor: '#F5A623', padding: '2px 4px', borderRadius: '4px', fontSize: '12px', color: '#fff' }}>📋</span>}
        </div>
      </div>

      {/* Context Menu Dropdown */}
      {menuOpen && (
        <div ref={menuRef} style={{ position: 'absolute', top: '40px', left: '40px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10, width: '180px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          {activeRes ? (
            <>
              <div onClick={() => { setActiveModal('guestInfo'); setMenuOpen(false); }} style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#333', borderBottom: '1px solid #f0f0f0' }}>Guest information</div>
              {room.status === 'OCCUPIED' ? (
                <div onClick={() => { handleAction('CHECKED_OUT'); setMenuOpen(false); }} style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#333' }}>Check-out</div>
              ) : (
                <div onClick={() => { handleAction('CHECKED_IN'); setMenuOpen(false); }} style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#333' }}>Check-in guest</div>
              )}
              <div style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#888' }}>Modify check-out</div>
              <div style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#888' }}>Additional access</div>
              <div style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#888' }}>Records</div>
            </>
          ) : (
            <>
              <div onClick={() => { setActiveModal('checkIn'); setMenuOpen(false); }} style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#333', borderBottom: '1px solid #f0f0f0' }}>Check-in guest</div>
              {room.status === 'CLEANING_REQUIRED' && (
                <div onClick={async () => {
                  await fetch('/api/rooms', { method: 'PUT', body: JSON.stringify({ id: room.id, status: 'AVAILABLE' }) });
                  onUpdate();
                }} style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#333' }}>Mark as clean</div>
              )}
              <div style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#888', borderBottom: '1px solid #f0f0f0' }}>Records</div>
              <div onClick={async () => {
                if (confirm('Are you sure you want to delete this room?')) {
                  await fetch(`/api/rooms/${room.id}`, { method: 'DELETE' });
                  onUpdate();
                }
              }} style={{ padding: '10px 15px', fontSize: '13px', cursor: 'pointer', color: '#E02020' }}>Delete room</div>
            </>
          )}
        </div>
      )}

      {/* Guest Information Modal */}
      {activeModal === 'guestInfo' && activeRes && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '4px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', color: '#333' }}>Guest information</h3>
              <span onClick={() => setActiveModal('none')} style={{ cursor: 'pointer', color: '#999', fontSize: '18px' }}>✕</span>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#333' }}>Rooms</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Secret Gem Hotel - {room.floor?.name || 'Floor'} - {room.roomNumber} &nbsp;&nbsp;&nbsp; {room.type}</div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#333' }}>Check-in</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{new Date(activeRes.checkIn).toLocaleString()}</div>
              </div>
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px dashed #eee' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#333' }}>Check-out</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{new Date(activeRes.checkOut).toLocaleString()}</div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '10px', color: '#333' }}>Guest</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                      <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Name</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Contact information</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Operation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 10px', color: '#666' }}>{activeRes.guestName}</td>
                      <td style={{ padding: '12px 10px', color: '#666' }}>{activeRes.guestEmail || activeRes.guestPhone || '-'}</td>
                      <td style={{ padding: '12px 10px', color: '#0078FF', cursor: 'pointer' }}>Edit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Check In Guest Modal */}
      {activeModal === 'checkIn' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '4px', width: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', color: '#333' }}>Check in guest</h3>
              <span onClick={() => setActiveModal('none')} style={{ cursor: 'pointer', color: '#999', fontSize: '18px' }}>✕</span>
            </div>
            
            <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Form implementation for checking in guest matching TT Hotel */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ color: '#E02020', display: 'inline' }}>*</div> <div style={{ display: 'inline', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>Rooms</div>
                <div style={{ marginTop: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', fontSize: '13px', color: '#555' }}>
                  Secret Gem Hotel-{room.floor?.name || 'Floor'}-{room.roomNumber} &nbsp;&nbsp;&nbsp; <span style={{float:'right'}}>✕</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#E02020', display: 'inline' }}>*</div> <div style={{ display: 'inline', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>Time of check-in/check-out</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                  <input type="datetime-local" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', color: '#666' }} />
                  <span style={{ color: '#999' }}>—</span>
                  <input type="datetime-local" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', color: '#666' }} />
                </div>
              </div>

              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '15px', color: '#333' }}>Guest</div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ color: '#E02020', display: 'inline' }}>*</div> <div style={{ display: 'inline', fontSize: '13px', color: '#555' }}>Name</div>
                  <input type="text" placeholder="Please enter here" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px', fontSize: '13px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#555' }}>Contact information</div>
                  <div style={{ display: 'flex', marginTop: '5px' }}>
                    <select style={{ padding: '8px', border: '1px solid #ddd', borderRight: 'none', borderRadius: '4px 0 0 4px', backgroundColor: '#fff', fontSize: '13px' }}>
                      <option>Email</option>
                      <option>Phone</option>
                    </select>
                    <input type="text" placeholder="Please enter here" style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '0 4px 4px 0', fontSize: '13px' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ color: '#0078FF', fontSize: '13px', marginBottom: '10px', cursor: 'pointer' }}>+ Add guest</div>
              <div style={{ color: '#0078FF', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ backgroundColor: '#0078FF', color: 'white', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>i</span> Record payment
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '10px', color: '#333' }}>Unlock method</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#333' }}>
                    <input type="radio" name="unlock" defaultChecked /> Card
                  </label>
                  <input type="text" defaultValue="1" style={{ width: '80px', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#666' }}>
                    <input type="radio" name="unlock" /> Ekey
                  </label>
                </div>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '15px', lineHeight: '1.4' }}>
                  If there are guest cards marked as lost, they will be written into new card and be disabled from lock when the new card used on the lock.
                </p>
              </div>

            </div>
            
            <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setActiveModal('none')} style={{ padding: '8px 20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#555' }}>Cancel</button>
              <button onClick={() => { alert('Mock Check-in successful'); window.location.reload(); }} style={{ padding: '8px 25px', backgroundColor: '#0078FF', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Ok</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
