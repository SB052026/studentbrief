import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Contact Us - StudentBrief' }

export default function ContactPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>📞 Contact Us</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Koi sawaal ya problem? Humse baat karo</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>📧</span>
            <div>
              <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Email</p>
              <a href="studentbrief26@gmail.com" style={{ color: '#1a3c8f', fontSize: '0.85rem', textDecoration: 'none' }}>support@studentbrief.in</a>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🌐</span>
            <div>
              <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Website</p>
              <p style={{ color: '#1a3c8f', fontSize: '0.85rem' }}>www.studentbrief.in</p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>⏰</span>
            <div>
              <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Support Hours</p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Monday - Saturday, 10 AM - 6 PM</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Humein email karo</p>
          <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.85rem' }}>Hum 24 ghante ke andar reply karenge</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
