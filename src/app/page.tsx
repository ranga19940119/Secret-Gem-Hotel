'use client';

import React from 'react';
import styles from './home.module.css';

export default function HomePage() {
  // Hardcoded room showcase based on user's screenshot
  const rooms = [
    {
      name: 'Deluxe Room',
      image: '/gallery/874333694.jpg',
      price: '$75',
      features: ['40 m²', '1 Full Bed', 'Balcony', 'Lake view', 'Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Soundproof']
    },
    {
      name: 'Double Room with Garden View',
      image: '/gallery/830277755.jpg',
      price: '$90',
      features: ['40 m²', '1 Queen Bed', 'Garden View', 'Soundproof', 'Free Wifi']
    },
    {
      name: 'Deluxe Double Room with Balcony and Sea View',
      image: '/gallery/874920463.jpg',
      price: '$100',
      features: ['40 m²', '1 Queen Bed', 'High floor', 'Balcony', 'Sea View', 'Soundproof', 'Free Wifi']
    }
  ];

  const galleryImages = [
    '/gallery/852029561.jpg',
    '/gallery/854434848.jpg',
    '/gallery/854434850.jpg',
    '/gallery/874337821.jpg',
    '/gallery/874337831.jpg',
    '/gallery/874347658.jpg',
    '/gallery/874844329.jpg',
    '/gallery/874844337.jpg',
    '/gallery/874920474.jpg',
    '/gallery/874920482.jpg',
    '/gallery/874920484.jpg',
    '/gallery/831703168.jpg'
  ];

  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Navbar Overlay */}
      <nav style={{ position: 'absolute', top: 0, width: '100%', padding: '30px 50px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ color: '#d4af37', fontSize: '24px', letterSpacing: '2px', fontFamily: 'Playfair Display, serif' }}>
          SECRET GEM
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Rooms</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Gallery</a>
          <a href="/admin" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* We use one of the best gallery images as hero background */}
        <img src="/gallery/874920484.jpg" alt="Secret Gem Hotel" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.subtitle}>Welcome to</div>
          <h1 className={styles.title}>Secret Gem</h1>
          <div style={{ fontSize: '1.2rem', marginBottom: '40px', letterSpacing: '2px', fontWeight: 300 }}>Experience Unparalleled Luxury</div>
          <button className={styles.bookBtn}>Discover Our Rooms</button>
        </div>
      </section>

      {/* Rooms Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>OUR ROOMS & SUITES</h2>
        <div className={styles.roomsGrid}>
          {rooms.map((room, index) => (
            <div key={index} className={styles.roomCard}>
              <div className={styles.roomImageContainer}>
                <img src={room.image} alt={room.name} className={styles.roomImage} />
              </div>
              <div className={styles.roomInfo}>
                <h3 className={styles.roomName}>{room.name}</h3>
                <div className={styles.roomPrice}>{room.price} <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>/ night</span></div>
                <div className={styles.roomFeatures}>
                  {room.features.map((feature, i) => (
                    <span key={i} className={styles.featureTag}>{feature}</span>
                  ))}
                </div>
                <button className={styles.reserveBtn}>Reserve Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Image Gallery */}
      <section className={styles.section} style={{ backgroundColor: '#050505' }}>
        <h2 className={styles.sectionTitle}>THE SECRET GEM GALLERY</h2>
        <div className={styles.galleryGrid}>
          {galleryImages.map((src, index) => (
            <div key={index} className={styles.galleryItem}>
              <img src={src} alt="Gallery" className={styles.galleryImg} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div style={{ fontSize: '20px', fontFamily: 'Playfair Display, serif', color: '#d4af37', marginBottom: '15px' }}>Secret Gem Hotel</div>
        <p style={{ margin: '0 0 10px 0', fontSize: '13px', letterSpacing: '1px' }}>123 Luxury Avenue, Paradise Island</p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.5 }}>&copy; 2026 Secret Gem Hotel. All rights reserved.</p>
      </footer>
    </main>
  );
}
