'use client';

import React from 'react';

export default function DeleteFloorButton({ floorId }: { floorId: string }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this floor and ALL rooms inside it?')) return;

    try {
      const res = await fetch(`/api/floors/${floorId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        alert('Failed to delete floor');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting floor');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#ff4d4f',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '0 5px',
        marginLeft: '10px'
      }}
      title="Delete Floor"
    >
      ✕
    </button>
  );
}
