import styles from './rooms.module.css';
import Link from 'next/link';

// Mock data for rooms
const publicRooms = [
  {
    id: '1',
    title: 'Standard Double',
    price: 150,
    description: 'A beautifully appointed room perfect for couples, featuring our signature Tuya Smart locks and luxury bedding.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'Deluxe Suite',
    price: 280,
    description: 'Experience ultimate comfort in our spacious Deluxe Suite with premium gold accents and stunning views.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'Presidential Gem',
    price: 500,
    description: 'Our most exclusive offering. Unparalleled luxury, expansive space, and VIP service from check-in to check-out.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80'
  }
];

export default function RoomsPage() {
  return (
    <div className={styles.roomsContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>Secret Gem</div>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About Us</Link>
          <Link href="/rooms" className={styles.navLink}>Rooms</Link>
          <Link href="/contact" className={styles.navLink}>Contact Us</Link>
        </nav>
      </header>

      <h1 className={styles.pageTitle}>Our Luxury Rooms</h1>
      <p className={styles.pageSubtitle}>
        Select from our range of exquisite rooms, each designed with your ultimate comfort in mind. All rooms feature Tuya Smart Fingerprint & Card access.
      </p>

      <div className={styles.roomsGrid}>
        {publicRooms.map(room => (
          <div key={room.id} className={styles.roomCard}>
            <div 
              className={styles.roomImagePlaceholder}
              style={{ backgroundImage: `url(${room.image})` }}
            >
              {!room.image && 'Image'}
            </div>
            <div className={styles.roomInfo}>
              <h2 className={styles.roomTitle}>{room.title}</h2>
              <div className={styles.roomPrice}>
                ${room.price} <span>/ night</span>
              </div>
              <p className={styles.roomDescription}>{room.description}</p>
              <button className={styles.bookButton}>Reserve Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
