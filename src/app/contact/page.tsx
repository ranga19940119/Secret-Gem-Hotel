import Link from 'next/link';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)', color: 'white' }}>
      <header style={{ padding: '30px 50px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>Secret Gem</div>
        <nav style={{ display: 'flex', gap: '40px' }}>
          <Link href="/" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Home</Link>
          <Link href="/about" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>About Us</Link>
          <Link href="/rooms" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Rooms</Link>
          <Link href="/contact" style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Contact Us</Link>
        </nav>
      </header>
      <main style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-gold)', fontSize: '3rem', marginBottom: '30px' }}>Contact Us</h1>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '40px' }}>
          Have questions about a reservation or our facilities? Reach out to our dedicated team.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div><strong>Email:</strong> info@secretgemhotel.com</div>
          <div><strong>Phone:</strong> +1 (555) 123-4567</div>
        </div>
      </main>
    </div>
  );
}
