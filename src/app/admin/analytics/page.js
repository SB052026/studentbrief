'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminAnalyticsPage() {
  const [activities, setActivities] = useState([])
  const [locationStats, setLocationStats] = useState([])
  const [deviceStats, setDeviceStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('realtime')
  const [instructions, setInstructions] = useState({ mock: '', pyp: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function fetchData() {
    const supabase = createClient()
    const [{ data: acts }, { data: settings }] = await Promise.all([
      supabase.from('user_activity').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('site_settings').select('*').in('key', ['mock_instructions', 'pyp_instructions']),
    ])
    setActivities(acts || [])

    // Location stats
    const locMap = {}
    acts?.forEach(a => {
      if (!a.location_name) return
      const city = a.location_name.split(',')[2]?.trim() || a.location_name.split(',')[0]?.trim()
      locMap[city] = (locMap[city] || 0) + 1
    })
    const locArr = Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
    setLocationStats(locArr)

    // Device stats
    const devMap = {}
    acts?.forEach(a => {
      if (!a.device) return
      devMap[a.device] = (devMap[a.device] || 0) + 1
    })
    setDeviceStats(Object.entries(devMap).sort((a, b) => b[1] - a[1]))

    // Instructions
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
    setMsg('✅ Instructions save ho gayi!')
    setTimeout(() => setMsg(''), 3000)
  }

  const tabs = [
    { key: 'realtime', label: '🔴 Realtime' },
    { key: 'locations', label: '📍 Locations' },
    { key: 'devices', label: '📱 Devices' },
    { key: 'instructions', label: '📋 Instructions' },
  ]

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>📊 Analytics & Instructions</h1>
        <button onClick={fetchData} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>🔄 Refresh</button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a3c8f' }}>{activities.length}</p>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Total Tests</p>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>{activities.filter(a => a.test_type === 'mock').length}</p>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Mock Tests</p>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0891b2' }}>{activities.filter(a => a.test_type === 'pyp').length}</p>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>PYP Papers</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Realtime */}
      {activeTab === 'realtime' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p> :
            activities.slice(0, 20).map((act, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{act.test_title}</p>
                  <span style={{ background: act.test_type === 'mock' ? '#dbeafe' : '#cffafe', color: act.test_type === 'mock' ? '#1e40af' : '#0e7490', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{act.test_type?.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>📍 {act.location_name ? act.location_name.substring(0, 60) + '...' : 'Location N/A'}</p>
                <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>📱 {act.device || 'Unknown'}</p>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>🕐 {new Date(act.created_at).toLocaleString('en-IN')}</p>
              </div>
            ))
          }
        </div>
      )}

      {/* Locations */}
      {activeTab === 'locations' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📍 Top Locations</h2>
          {locationStats.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>Koi data nahi</p> :
            locationStats.map(([city, count], i) => (
              <div key={i} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>📍 {city}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a3c8f' }}>{count} users</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px' }}>
                  <div style={{ height: '6px', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '9999px', width: `${(count / locationStats[0][1]) * 100}%` }} />
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Devices */}
      {activeTab === 'devices' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📱 Device Stats</h2>
          {deviceStats.map(([device, count], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                {device === 'Android' ? '🤖' : device === 'iOS' ? '🍎' : device === 'Windows' ? '🖥️' : '💻'} {device}
              </span>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>{count} users</span>
            </div>
          ))}
        </div>
      )}

      {/* Instructions Edit */}
      {activeTab === 'instructions' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '0.5rem' }}>📋 Instructions Edit Karo</h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
            Use karo: <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{'{questions}'}</code> aur <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{'{duration}'}</code> — ye automatically replace ho jayenge
          </p>

          {msg && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>{msg}</div>}

          <label style={labelStyle}>🧪 Mock Test Instructions</label>
          <textarea
            style={{ ...inputStyle, height: '150px', resize: 'vertical' }}
            value={instructions.mock}
            onChange={e => setInstructions(p => ({ ...p, mock: e.target.value }))}
            placeholder="Mock test instructions likhein..."
          />

          <label style={labelStyle}>📄 PYP Instructions</label>
          <textarea
            style={{ ...inputStyle, height: '150px', resize: 'vertical' }}
            value={instructions.pyp}
            onChange={e => setInstructions(p => ({ ...p, pyp: e.target.value }))}
            placeholder="PYP instructions likhein..."
          />

          <button onClick={saveInstructions} disabled={saving} style={{ width: '100%', background: '#1a3c8f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>
            {saving ? 'Saving...' : '💾 Save Karo'}
          </button>
        </div>
      )}
    </div>
  )
}
