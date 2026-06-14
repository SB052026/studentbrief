import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Terms & Conditions - StudentBrief' }

export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'StudentBrief use karke aap in terms & conditions se agree karte ho. Agar aap agree nahi karte to kripya website use na karein.' },
    { title: '2. Account Registration', content: 'Account banane ke liye aapko sahi information deni hogi. Aap apne account ki security ke liye khud responsible ho.' },
    { title: '3. Subscription', content: 'Mock Test aur PYP ke liye ₹29/month subscription hai with 7 din free trial. Subscription automatically renew nahi hoti.' },
    { title: '4. Live Test', content: 'Live test me participate karne ke liye ₹9 per test fee hai. Test ke dauran cheating strictly prohibited hai. Cheating detect hone par aap disqualify ho sakte ho.' },
    { title: '5. Rewards', content: 'Live test ke winners ko rewards (books, laptops, etc.) admin dwara assign kiye jate hain. Rewards ki delivery genuine winners ko hi hogi.' },
    { title: '6. Payment', content: 'Saare payments Razorpay ke through secure tarike se process hote hain. Payment ke baad service turant activate ho jati hai.' },
    { title: '7. Prohibited Activities', content: 'Cheating, multiple accounts banana, ya website ko misuse karna prohibited hai. Aisa karne par account ban ho sakta hai.' },
    { title: '8. Content Accuracy', content: 'Hum jobs aur results ki information accurate rakhne ki koshish karte hain, lekin final verification ke liye official website check karein.' },
    { title: '9. Limitation of Liability', content: 'StudentBrief kisi bhi job application ke result ya exam ke outcome ke liye responsible nahi hai. Hum sirf information aur practice platform provide karte hain.' },
    { title: '10. Changes to Terms', content: 'Hum in terms ko kabhi bhi update kar sakte hain. Updated terms is page par publish honge.' },
  ]

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>📜 Terms & Conditions</h1>
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
