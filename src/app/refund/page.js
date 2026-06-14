import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Refund Policy - StudentBrief' }

export default function RefundPage() {
  const sections = [
    { title: '1. Subscription Refund', content: 'Monthly subscription (₹29) ke liye 7 din ka free trial milta hai. Trial period me aap bina kisi charge ke cancel kar sakte ho. Trial ke baad payment hone par refund nahi milega.' },
    { title: '2. Live Test Fee', content: 'Live test ki ₹9 fee non-refundable hai, kyunki ye ek paid participation hai. Agar test technical reason se cancel hota hai to fee refund ki jayegi.' },
    { title: '3. Technical Issues', content: 'Agar payment ho gaya lekin service activate nahi hui (technical error ke karan), to humse contact karo. Verify hone par poora refund milega.' },
    { title: '4. Duplicate Payment', content: 'Galti se double payment hone par, extra amount 5-7 working days me refund kar diya jayega.' },
    { title: '5. Refund Process', content: 'Refund approve hone par amount 5-7 working days me aapke original payment method me wapas aa jayega.' },
    { title: '6. How to Request Refund', content: 'Refund ke liye support@studentbrief.in par email karo apni payment details ke saath. Hum 48 ghante me reply karenge.' },
  ]

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>💰 Refund Policy</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>Last updated: January 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sections.map((section, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '0.5rem' }}>{section.title}</h2>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', borderRadius: '16px', padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#9a3412', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>Refund chahiye?</p>
          <a href="studentbrief26@gmail.com" style={{ color: '#c2410c', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>support@studentbrief.in par email karo</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
