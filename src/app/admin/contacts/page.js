'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      setSubmissions(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('contact_submissions').delete().eq('id', id)
    setSubmissions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📞 Contact Submissions</h1>
        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>{submissions.length} Total</span>
      </div>

      {loading ? <div style={emptyState}>Loading...</div> : submissions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {submissions.map(sub => (
            <div key={sub.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #1a3c8f' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>👤 {sub.name}</span>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '1px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>📱 {sub.mobile}</span>
                  </div>
                  {sub.email && <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>📧 {sub.email}</p>}
                  <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.5, background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', marginTop: '6px' }}>💬 {sub.message}</p>
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '6px' }}>🕐 {new Date(sub.created_at).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => handleDelete(sub.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}>
          <p style={{ fontSize: '2rem' }}>📞</p>
          <p>Koi submission nahi hai abhi</p>
        </div>
      )}
    </div>
  )
}
