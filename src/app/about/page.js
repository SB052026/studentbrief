import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'About Us - StudentBrief' }

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>ℹ️ About Us</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>StudentBrief ke baare me jaano</p>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1.1rem', marginBottom: '0.75rem' }}>🎯 Humara Mission</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
            StudentBrief ka mission hai har student ko exam ki taiyari ke liye best resources ek jagah dena. Latest government jobs, results, mock tests, previous year papers aur live tests — sab kuch ek platform par.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1.1rem', marginBottom: '0.75rem' }}>💡 Hum Kya Dete Hain</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '💼', text: 'Latest Government Jobs ki puri jankari' },
              { icon: '📊', text: 'Sabhi exams ke latest results' },
              { icon: '📝', text: 'Practice ke liye unlimited mock tests' },
              { icon: '📄', text: 'Previous year question papers' },
              { icon: '🏆', text: 'Live tests with rewards aur prizes' },
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#475569' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1.1rem', marginBottom: '0.75rem' }}>🌟 Kyu Chunein Humein</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Hum students ki success ke liye committed hain. Affordable price me quality content, anti-cheat live tests, aur transparent rewards system ke saath, StudentBrief students ka trusted partner hai exam ki taiyari me.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
