'use client';

import React, { useState } from 'react';
import styles from '../app/admin/console.module.css';
import TTRoomCard from './TTRoomCard';
import AddRoomForm from './AddRoomForm';

export default function TTRoomGrid({ initialRooms, floorsData }: { initialRooms: any[], floorsData: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // States for checkbox filters
  const [filters, setFilters] = useState({
    cleaningRequired: false,
    unoccupied: false,
    occupied: false,
    reserved: false,
    checkoutSoon: false,
    overdue: false,
  });

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters({ ...filters, [filterName]: !filters[filterName] });
  };

  const filteredRooms = initialRooms.filter(room => {
    // 1. Search Query
    if (searchQuery && !room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // 2. Type Filter
    if (typeFilter !== 'All' && room.type !== typeFilter) return false;
    
    // 3. Checkbox Filters (if any are active)
    const anyFilterActive = Object.values(filters).some(v => v);
    if (anyFilterActive) {
      if (filters.cleaningRequired && room.status !== 'CLEANING_REQUIRED') return false;
      if (filters.unoccupied && room.status !== 'AVAILABLE') return false;
      if (filters.occupied && room.status !== 'OCCUPIED') return false;
      if (filters.checkoutSoon && room.checkoutStatus !== 'SOON') return false;
      if (filters.overdue && room.checkoutStatus !== 'OVERDUE') return false;
    }
    
    return true;
  });

  return (
    <>
      <section className={styles.roomGrid}>
        {filteredRooms.map((room) => (
          <TTRoomCard key={room.id} room={room} onUpdate={() => window.location.reload()} />
        ))}
        <div style={{ padding: '0', backgroundColor: 'transparent' }}>
          <AddRoomForm availableFloors={floorsData} />
        </div>
      </section>

      {/* TT Hotel Exact Right Sidebar */}
      <aside className={styles.rightSidebar} style={{ backgroundColor: '#eeeeee', border: 'none', padding: '20px', width: '280px' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#000' }}>Search by name</div>
          <div style={{ display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Room number" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px 0 0 4px', fontSize: '14px' }} 
            />
            <button style={{ backgroundColor: '#0078FF', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#000' }}>Room type searching</div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}
          >
            <option value="All">All</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Presidential Gem">Presidential Gem</option>
          </select>
        </div>

        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', color: '#000' }}>Filter</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" checked={filters.cleaningRequired} onChange={() => handleFilterChange('cleaningRequired')} style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#FFE9D2', padding: '4px', borderRadius: '4px', display: 'flex' }}>🧹</span>
              Cleaning required
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" checked={filters.unoccupied} onChange={() => handleFilterChange('unoccupied')} style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '12px', borderRadius: '4px' }}></span>
              Unoccupied
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" checked={filters.occupied} onChange={() => handleFilterChange('occupied')} style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#0078FF', padding: '12px', borderRadius: '4px' }}></span>
              Occupied
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" checked={filters.reserved} onChange={() => handleFilterChange('reserved')} style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#F5A623', padding: '4px', borderRadius: '4px', display: 'flex' }}>📋</span>
              Reserved
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" checked={filters.checkoutSoon} onChange={() => handleFilterChange('checkoutSoon')} style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#F5A623', padding: '4px', borderRadius: '4px', display: 'flex', color: '#fff', fontSize: '12px' }}>⏳</span>
              Checking out soon
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" checked={filters.overdue} onChange={() => handleFilterChange('overdue')} style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#E02020', padding: '4px', borderRadius: '4px', display: 'flex', color: '#fff', fontSize: '12px' }}>↪</span>
              Overdue
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#F2DEDE', padding: '4px', borderRadius: '4px', display: 'flex', color: '#E02020', fontSize: '12px' }}>🔋</span>
              Low battery
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#D9534F', padding: '12px', borderRadius: '4px' }}></span>
              Under maintenance
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span style={{ backgroundColor: '#F2DEDE', padding: '4px', borderRadius: '4px', display: 'flex', color: '#E02020', fontSize: '12px' }}>🔒</span>
              No lock found
            </label>
          </div>
        </div>
      </aside>
    </>
  );
}
