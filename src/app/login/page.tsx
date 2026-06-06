'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('Network error occurred.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-dark)', fontFamily: 'var(--font-body)' }}>
      <div style={{ backgroundColor: 'var(--color-bg-panel)', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid var(--color-gold)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-gold)', marginBottom: '10px' }}>Admin Login</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Secret Gem Hotel Management</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-dark)', color: 'var(--color-text-main)', fontSize: '16px', boxSizing: 'border-box' }}
              required
            />
          </div>
          {error && <div style={{ color: '#ff4d4d', fontSize: '14px' }}>{error}</div>}
          <button type="submit" style={{ padding: '15px', backgroundColor: 'var(--color-gold)', color: '#000', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Login to Console
          </button>
        </form>
      </div>
    </div>
  );
}
