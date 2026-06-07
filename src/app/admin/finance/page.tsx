import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  const payments = await prisma.payment.findMany({
    orderBy: { date: 'desc' },
    include: {
      reservation: {
        include: { room: true }
      }
    }
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Finance Dashboard</h1>
        <Link href="/admin">
          <button style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back to Console</button>
        </Link>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px', display: 'inline-block' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Revenue Collected</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0078FF' }}>${totalRevenue.toFixed(2)}</div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Room</th>
              <th style={{ padding: '15px' }}>Guest</th>
              <th style={{ padding: '15px' }}>Method</th>
              <th style={{ padding: '15px' }}>Description</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', color: '#555' }}>{new Date(payment.date).toLocaleString()}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{payment.reservation.room.roomNumber}</td>
                <td style={{ padding: '15px' }}>{payment.reservation.guestName}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {payment.method}
                  </span>
                </td>
                <td style={{ padding: '15px', color: '#666' }}>{payment.description}</td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>
                  +${payment.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No payments recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
