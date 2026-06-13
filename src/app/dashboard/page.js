'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import Link from 'next/link'
import { getTrialDaysLeft, isTrialActive } from '@/lib/utils'

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh']

const JOB_INTERESTS = ['Govt Jobs','Bank Jobs','Railway Jobs','Defence Jobs','Police Jobs','Teaching Jobs','Engineering Jobs','Medical Jobs','State Jobs','SSC Jobs']

export default function DashboardPage() {
  const { user, dbUser, loading } = useUser()
  const { subscription, hasAccess, trialDaysLeft } = useSubscription(dbUser)
  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(null)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function startEdit() {
    setForm({
      name: dbUser?.name || '',
      mobile: dbUser?.mobile || '',
      age: dbUser?.age || '',
      education: dbUser?.education || '',
      state: dbUser?.state || '',
      district: dbUser?.district || '',
      city: dbUser?.city || '',
      village: dbUser?.village || '',
      pincode: dbUser?.pincode || '',
      interested_jobs: dbUser?.interested_jobs || '',
    })
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('users').update({
      ...form,
      age: parseInt(form.age) || null,
    }).eq('id', user.id)
    setSaving(false)
    setEditing(false)
    window.location.reload()
  }

  if (loading) return <Loader />

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'performance', label: '📊 Performance' },
    { id: 'subscription', label: '💳 Subscription' },
    { id: 'settings', label: '⚙️ Settings' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: 'Poppins, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f2460, #1a3c8f)', padding: '1.5rem 1rem 4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>
                Student<span style={{ color: '#f97316' }}>Brief</span>
              </span>
            </Link>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)', color: 'white',
              padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif',
            }}>
              🚪 Logout
            </button>
          </div>

          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white',
              border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0,
            }}>
              {dbUser?.name?.charAt(0)?.toUpperCase() || '👤'}
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '2px' }}>
                {dbUser?.name || 'Student'}
              </h1>
              <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.8rem' }}>
                {dbUser?.email || dbUser?.mobile || ''}
              </p>
              <span style={{
                background: hasAccess ? '#dcfce7' : '#fee2e2',
                color: hasAccess ? '#166534' : '#991b1b',
                padding: '2px 10px', borderRadius: '9999px',
                fontSize: '0.65rem', fontWeight: 700, display: 'inline-block', marginTop: '4px',
              }}>
                {hasAccess ? (isTrialActive(dbUser?.trial_start) ? `⏳ Trial — ${trialDaysLeft} din baaki` : '✅ Active') : '❌ Expired'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: '900px', margin: '-2rem auto 0', padding: '0 1rem' }}>
        <div style={{
          background: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex', overflow: 'hidden', marginBottom: '1.25rem',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 4px', border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? '#1a3c8f' : 'white',
                color: activeTab === tab.id ? 'white' : '#64748b',
                fontWeight: 700, fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem' }}>Personal Details</h2>
              {!editing && (
                <button onClick={startEdit} style={{
                  background: '#dbeafe', color: '#1e40af', border: 'none',
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                }}>
                  ✏️ Edit
                </button>
              )}
            </div>

            {!editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Name', value: dbUser?.name, icon: '👤' },
                  { label: 'Mobile', value: dbUser?.mobile, icon: '📱' },
                  { label: 'Email', value: dbUser?.email, icon: '📧' },
                  { label: 'Age', value: dbUser?.age ? `${dbUser.age} years` : null, icon: '🎂' },
                  { label: 'Education', value: dbUser?.education, icon: '🎓' },
                  { label: 'State', value: dbUser?.state, icon: '🗺️' },
                  { label: 'District', value: dbUser?.district, icon: '📍' },
                  { label: 'City', value: dbUser?.city, icon: '🏙️' },
                  { label: 'Village', value: dbUser?.village, icon: '🏘️' },
                  { label: 'Pincode', value: dbUser?.pincode, icon: '📮' },
                  { label: 'Interested Jobs', value: dbUser?.interested_jobs, icon: '💼' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem' }}>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>{item.icon} {item.label}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: item.value ? '#1e293b' : '#cbd5e1' }}>
                      {item.value || 'Not set'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Apna naam' },
                  { key: 'mobile', label: 'Mobile', type: 'tel', placeholder: '10 digit number' },
                  { key: 'age', label: 'Age', type: 'number', placeholder: 'Apni age' },
                  { key: 'education', label: 'Education', type: 'text', placeholder: '10th, 12th, Graduation...' },
                  { key: 'district', label: 'District', type: 'text', placeholder: 'Apna district' },
                  { key: 'city', label: 'City', type: 'text', placeholder: 'Apna city' },
                  { key: 'village', label: 'Village', type: 'text', placeholder: 'Apna village' },
                  { key: 'pincode', label: 'Pincode', type: 'text', placeholder: '6 digit pincode' },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '2px solid #e2e8f0', borderRadius: '10px',
                        fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif',
                        outline: 'none', color: '#1e293b',
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>State</label>
                  <select
                    value={form.state}
                    onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', color: '#1e293b' }}
                  >
                    <option value="">State select karo</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Interested Jobs</label>
                  <select
                    value={form.interested_jobs}
                    onChange={e => setForm(p => ({ ...p, interested_jobs: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', color: '#1e293b' }}
                  >
                    <option value="">Job category select karo</option>
                    {JOB_INTERESTS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                    {saving ? 'Saving...' : '💾 Save Karo'}
                  </button>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>📊 Performance Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {[
                  { label: 'Mock Tests', value: '0', icon: '📝', color: '#dbeafe' },
                  { label: 'PYP Attempts', value: '0', icon: '📄', color: '#fef3c7' },
                  { label: 'Live Tests', value: '0', icon: '🏆', color: '#dcfce7' },
                  { label: 'Total Attempts', value: '0', icon: '🎯', color: '#fce7f3' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: stat.color, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>💪 Strong Areas</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                Tests attempt karo — performance yahan dikhegi
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem', marginBottom: '1rem' }}>⚠️ Weak Areas</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                Tests attempt karo — weak areas yahan dikhenge
              </p>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1.25rem' }}>💳 Subscription</h2>
            <div style={{ background: hasAccess ? '#dcfce7' : '#fee2e2', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{hasAccess ? '✅' : '❌'}</div>
              <p style={{ fontWeight: 800, color: hasAccess ? '#166534' : '#991b1b', fontSize: '1rem' }}>
                {hasAccess ? (isTrialActive(dbUser?.trial_start) ? 'Free Trial Active' : 'Subscription Active') : 'Subscription Expired'}
              </p>
              {isTrialActive(dbUser?.trial_start) && (
                <p style={{ color: '#166534', fontSize: '0.8rem', marginTop: '4px' }}>{trialDaysLeft} din baaki hain</p>
              )}
            </div>
            {!hasAccess && (
              <Link href="/dashboard/subscribe" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem' }}>
                🚀 ₹29/month Subscribe Karo
              </Link>
            )}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/dashboard/mock-test" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#1e293b' }}>
                <span style={{ fontSize: '1.5rem' }}>📝</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>Mock Tests</p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Practice tests se taiyari karo</p>
                </div>
                <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
              </Link>
              <Link href="/dashboard/pyp" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#1e293b' }}>
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>Previous Year Papers</p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Purane papers se practice karo</p>
                </div>
                <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
              </Link>
              <Link href="/dashboard/live-test" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#1e293b' }}>
                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>Live Test</p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>₹9 me participate karo</p>
                </div>
                <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>⚙️ Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'StudentBrief', text: 'Exam ki taiyari ke liye best platform!', url: 'https://studentbrief.in' })
                    } else {
                      navigator.clipboard.writeText('https://studentbrief.in')
                      alert('Link copied!')
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🔗</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>Website Share Karo</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Dosto ke saath share karo</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
                </button>

                <Link href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px', textDecoration: 'none' }}>
                  <span style={{ fontSize: '1.5rem' }}>❓</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>Help & Support</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Koi problem? Humse baat karo</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
                </Link>

                <Link href="/about" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px', textDecoration: 'none' }}>
                  <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>About Us</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>StudentBrief ke baare me jaano</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
                </Link>

                <Link href="/privacy" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px', textDecoration: 'none' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔒</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>Privacy Policy</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Humari privacy policy padho</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
                </Link>

                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#fee2e2', borderRadius: '12px', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🚪</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#991b1b' }}>Logout</p>
                    <p style={{ fontSize: '0.72rem', color: '#ef4444' }}>Account se logout karo</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
