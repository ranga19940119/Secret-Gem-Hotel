import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>Secret Gem</div>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About Us</Link>
          <Link href="/rooms" className={styles.navLink}>Rooms</Link>
          <Link href="/contact" className={styles.navLink}>Contact Us</Link>
        </nav>
      </header>

      <section className={styles.heroSection}>
        <h1 className={styles.title}>Experience Pure Luxury</h1>
        <p className={styles.subtitle}>
          Discover the hidden elegance of Secret Gem Resort. A place where comfort meets sophistication.
        </p>
        <Link href="/rooms">
          <button className={styles.bookButton}>Book Your Stay</button>
        </Link>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Us</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✦</div>
            <h3 className={styles.featureTitle}>Luxury Rooms</h3>
            <p className={styles.featureText}>
              Immerse yourself in our beautifully designed rooms, featuring premium amenities and stunning views.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✦</div>
            <h3 className={styles.featureTitle}>Smart Security</h3>
            <p className={styles.featureText}>
              State-of-the-art Tuya Smart Fingerprint and Card lock systems for your ultimate peace of mind.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✦</div>
            <h3 className={styles.featureTitle}>World-Class Service</h3>
            <p className={styles.featureText}>
              Our dedicated staff is here to ensure your stay is flawless from check-in to check-out.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
