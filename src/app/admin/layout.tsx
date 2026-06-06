import React from 'react';
import styles from './admin.module.css';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <header className={styles.topBar}>
        <div style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '20px', marginRight: '30px' }}>
          Secret Gem Admin
        </div>
        <Link href="/admin" className={`${styles.navItem} ${styles.navItemActive}`}>
          Console
        </Link>
        <Link href="/admin/reservations" className={styles.navItem}>
          Reservation
        </Link>
        <Link href="/admin/stay-records" className={styles.navItem}>
          Stay records
        </Link>
        <Link href="/admin/cms" className={styles.navItem}>
          Website CMS
        </Link>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
