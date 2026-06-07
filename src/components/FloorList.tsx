'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FloorList({ floors, currentFloorId }: { floors: any[], currentFloorId?: string }) {
  const router = useRouter();
  
  const [contextMenu, setContextMenu] = useState<{ floorId: string, x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRightClick = (e: React.MouseEvent, floorId: string) => {
    e.preventDefault();
    setContextMenu({
      floorId,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleSelect = (floorId: string) => {
    // Navigate instantly without full page reload
    router.push(`/admin?floor=${floorId}`);
  };

  const handleDelete = async (floorId: string) => {
    setContextMenu(null);
    if (!confirm('Are you sure you want to delete this floor and ALL rooms inside it?')) return;

    try {
      const res = await fetch(`/api/floors/${floorId}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        alert('Failed to delete floor');
      }
    } catch (err) {
      alert('Error deleting floor');
    }
  };

  return (
    <>
      <div 
        onClick={() => router.push('/admin')}
        style={{ 
          padding: '10px', 
          backgroundColor: !currentFloorId ? '#007bff' : 'transparent', 
          color: !currentFloorId ? 'white' : 'var(--color-text-main)', 
          borderRadius: '4px', 
          marginBottom: '5px',
          cursor: 'pointer'
        }}
      >
        All Floors
      </div>
      
      {floors.map(floor => (
        <div 
          key={floor.id} 
          onClick={() => handleSelect(floor.id)}
          onContextMenu={(e) => handleRightClick(e, floor.id)}
          style={{ 
            padding: '10px', 
            cursor: 'pointer', 
            borderBottom: '1px solid var(--color-border)', 
            backgroundColor: currentFloorId === floor.id ? 'rgba(212,175,55,0.2)' : 'transparent', 
            color: currentFloorId === floor.id ? 'var(--color-gold)' : 'inherit' 
          }}
        >
          {floor.name}
        </div>
      ))}

      {contextMenu && (
        <div 
          ref={menuRef}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            zIndex: 1000,
            padding: '5px 0',
            minWidth: '150px'
          }}
        >
          <div 
            onClick={() => handleDelete(contextMenu.floorId)}
            style={{ padding: '10px 15px', color: '#ff4d4f', cursor: 'pointer', fontSize: '14px' }}
          >
            Delete Floor
          </div>
        </div>
      )}
    </>
  );
}
