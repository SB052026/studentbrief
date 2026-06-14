import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Privacy Policy - StudentBrief' }

export default function PrivacyPage() {
  const sections = [
    { title: '1. Information Hum Collect Karte Hain', content: 'Hum aapka naam, email, mobile number, aur profile details (age, education, location) collect karte hain jab aap register karte ho. Ye information aapko better service dene ke liye use hoti hai.' },
    { title: '2. Information Ka Use', content: 'Aapki information ka use account banane, subscription manage karne, payment process karne, aur aapko relevant jobs aur results dikhane ke liye hota hai.' },
    { title: '3. Information Sharing', content: 'Hum aapki personal information kisi third party ko sell nahi karte. Payment ke liye hum Razorpay use karte hain jo secure hai.' },
    { title: '4. Data Security', content: 'Aapka data Supabase ke secure servers par store hota hai. Hum industry standard security measures use karte hain aapke data ko protect karne ke liye.' },
    { title: '5. Cookies', content: 'Hum cookies use karte hain aapko logged in rakhne aur better experience dene ke liye.' },
    { title: '6. Live Test Monitoring', content: 'Live test ke dauran cheating rokne ke liye hum camera, microphone aur location access lete hain. Ye data sirf test integrity ke liye use hota hai.' },
    { title: '7. Aapke Rights', content: 'Aap apni profile information kabhi bhi edit ya delete kar sakte ho. Account delete karne ke liye humse contact karo.' },
    { title: '8. Changes', content: 'Hum is privacy policy ko time time par update kar sakte hain. Changes is page par publish honge.' },
  ]

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>🔒 Privacy Policy</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>Last updated: January 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sections.map((section, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '0.5rem' }}>{section.title}</h2>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
