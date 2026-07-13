'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, pageTitle } from '@/lib/adminStyles'

export default function AdminAnalyticsPage() {
  const [activities, setActivities] = useState([])
  const [pdfDownloads, setPdfDownloads] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [locationStats, setLocationStats] = useState([])
  const [deviceStats, setDeviceStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('realtime')
  const [instructions, setInstructions] = useState({ mock: '', pyp: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function fetchData() {
    setLoading(true)
    const supabase = createClient()
    const [{ data: acts }, { data: pdfs }, { data: settings }] = await Promise.all([
      supabase.from('user_activity').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('pdf_downloads').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('site_settings').select('*').in('key', ['mock_instructions', 'pyp_instructions']),
    ])
    setActivities(acts || [])
    setPdfDownloads(pdfs || [])
    setFeedbacks(feedbacks || [])

    const locMap = {}
    acts?.forEach(a => {
      if (!a.location_name) return
      const parts = a.location_name.split(',').map(p => p.trim())
      const city = parts[2] || parts[1] || parts[0]
      locMap[city] = (locMap[city] || 0) + 1
    })
    setLocationStats(Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 10))

    const devMap = {}
    acts?.forEach(a => { if (a.device) devMap[a.device] = (devMap[a.device] || 0) + 1 })
    setDeviceStats(Object.entries(devMap).sort((a, b) => b[1] - a[1]))

    const obj = {}
    settings?.forEach(s => { obj[s.key] = s.value })
    setInstructions({ mock: obj.mock_instructions || '', pyp: obj.pyp_instructions || '' })
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function saveInstructions() {
    setSaving(true)
    const supabase = createClient()
    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'mock_instructions', value: instructions.mock }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'pyp_instructions', value: instructions.pyp }, { onConflict: 'key' }),
    ])
    setSaving(false)
    setMsg('✅ Saved!')
    setTimeout(() => setMsg(''), 3000)
  }

  const tabs = [
    { key: 'realtime', label: '🔴 Realtime' },
    { key: 'locations', label: '📍 Locations' },
    { key: 'devices', label: '📱 Devices' },
    { key: 'pdf', label: '📥 PDF Downloads' },
    { key: 'feedback', label: '⭐ Feedback' },
    { key: 'instructions', label: '📋 Instructions' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📊 Analytics</h1>
        <button onClick={fetchData} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>🔄 Refresh</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: activities.length, color: '#1a3c8f' },
          { label: 'Mock', value: activities.filter(a => a.test_type === 'mock').length, color: '#16a34a' },
          { label: 'PYP', value: activities.filter(a => a.test_type === 'pyp').length, color: '#0891b2' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'realtime' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p> :
            activities.slice(0, 20).map((act, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.82rem' }}>{act.test_title}</p>
                  <span style={{ background: act.test_type === 'mock' ? '#dbeafe' : '#cffafe', color: act.test_type === 'mock' ? '#1e40af' : '#0e7490', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{act.test_type?.toUpperCase()}</span>
                </div>
                {act.location_name && (
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                    <p>📍 {act.location_name.split(',').slice(0,3).join(',')}</p>
                    {act.location_lat && act.location_lng && (
                      <a href={`https://www.google.com/maps?q=${act.location_lat},${act.location_lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1a3c8f', fontWeight: 600, fontSize: '0.65rem' }}>
                        🗺️ Map pe dekho ({act.location_lat?.toFixed(4)}, {act.location_lng?.toFixed(4)})
                      </a>
                    )}
                  </div>
                )}
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📱 {act.device || 'Unknown'}</p>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>🕐 {new Date(act.created_at).toLocaleString('en-IN')}</p>
              </div>
            ))
          }
        </div>
      )}

      {activeTab === 'locations' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {locationStats.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8' }}>Koi data nahi</p> :
            locationStats.map(([city, count], i) => (
              <div key={i} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>📍 {city}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a3c8f' }}>{count}</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px' }}>
                  <div style={{ height: '6px', background: '#1a3c8f', borderRadius: '9999px', width: `${(count / locationStats[0][1]) * 100}%` }} />
                </div>
              </div>
            ))
          }
        </div>
      )}

      {activeTab === 'devices' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {deviceStats.map(([device, count], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                {device === 'Android' ? '🤖' : device === 'iOS' ? '🍎' : '🖥️'} {device}
              </span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pdf' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>{pdfDownloads.length}</p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Downloads</p>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1a3c8f' }}>{[...new Set(pdfDownloads.map(d => d.pdf_type))].length}</p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Types</p>
            </div>
          </div>
          {pdfDownloads.map((dl, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.82rem' }}>{dl.pdf_title}</p>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{dl.pdf_type}</span>
              </div>
              {dl.category && <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📋 {dl.category}</p>}
              {dl.location_name && (
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  <p>📍 {dl.location_name.split(',').slice(0,3).join(',')}</p>
                  {dl.location_lat && dl.location_lng && (
                    <a href={`https://www.google.com/maps?q=${dl.location_lat},${dl.location_lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1a3c8f', fontWeight: 600, fontSize: '0.65rem' }}>
                      🗺️ Map pe dekho
                    </a>
                  )}
                </div>
              )}
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📱 {dl.device || 'Unknown'}</p>
              <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>🕐 {new Date(dl.created_at).toLocaleString('en-IN')}</p>
            </div>
          ))}
          {pdfDownloads.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Koi download nahi hua abhi</p>}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f97316' }}>{feedbacks.length}</p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total</p>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>{feedbacks.filter(f => f.rating >= 4).length}</p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Positive</p>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1a3c8f' }}>
                {feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 'N/A'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Avg Rating</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {feedbacks.map((fb, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <p style={{ fontSize: '1rem' }}>{'⭐'.repeat(fb.rating)}</p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(fb.created_at).toLocaleString('en-IN')}</span>
                </div>
                {fb.comment && <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '4px' }}>"{fb.comment}"</p>}
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📱 {fb.device} • 📄 {fb.page}</p>
              </div>
            ))}
            {feedbacks.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Koi feedback nahi abhi</p>}
          </div>
        </div>
      )}

      {activeTab === 'instructions' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {msg && <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.75rem' }}>{msg}</div>}
          <div style={{ background: '#f0f4ff', borderRadius: '8px', padding: '8px 12px', marginBottom: '1rem', fontSize: '0.75rem', color: '#1a3c8f' }}>
            Use: <code style={{ background: '#e0e7ff', padding: '1px 4px', borderRadius: '4px' }}>{'{questions}'}</code> aur <code style={{ background: '#e0e7ff', padding: '1px 4px', borderRadius: '4px' }}>{'{duration}'}</code>
          </div>
          <label style={labelStyle}>🧪 Mock Test Instructions</label>
          <textarea style={{ ...inputStyle, height: '140px', resize: 'vertical' }} value={instructions.mock} onChange={e => setInstructions(p => ({ ...p, mock: e.target.value }))} />
          <label style={labelStyle}>📄 PYP Instructions</label>
          <textarea style={{ ...inputStyle, height: '140px', resize: 'vertical' }} value={instructions.pyp} onChange={e => setInstructions(p => ({ ...p, pyp: e.target.value }))} />
          <button onClick={saveInstructions} disabled={saving} style={{ ...btnPrimary, marginTop: '0.5rem' }}>
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      )}
    </div>
  )
}
