'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function AdminPypPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    exam_name: '',
    year: '',
    file_url: '',
  })

  async function fetchPapers() {
    const supabase = createClient()
    const { data } = await supabase
      .from('pyp')
      .select('*')
      .order('year', { ascending: false })
    setPapers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPapers() }, [])

  async function handleSave() {
    if (!form.exam_name || !form.year) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('pyp').insert({
      exam_name: form.exam_name,
      year: parseInt(form.year),
      file_url: form.file_url || null,
    })
    await fetchPapers()
    setShowForm(false)
    setForm({ exam_name: '', year: '', file_url: '' })
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('pyp').delete().eq('id', id)
    await fetchPapers()
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">PYP Papers Manage Karo</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Naya Paper Add Karo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="font-bold text-blue-900 mb-4">Naya PYP Paper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Exam Name *</label>
              <input
                className="input-field"
                value={form.exam_name}
                onChange={e => setForm(p => ({ ...p, exam_name: e.target.value }))}
                placeholder="SSC CGL, RRB NTPC..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Year *</label>
              <input
                type="number"
                className="input-field"
                value={form.year}
                onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                placeholder="2024"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">PDF Link</label>
              <input
                className="input-field"
                value={form.file_url}
                onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save Karo'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {papers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map(paper => (
            <div key={paper.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{paper.exam_name}</h3>
                <p className="text-xs text-gray-500 mt-1">Year: {paper.year}</p>
                {paper.file_url && (
                  <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                    PDF Link dekho →
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(paper.id)}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-3 py-1.5 rounded-lg transition shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Koi paper nahi hai" description="Naya PYP paper add karo" icon="📄" />
      )}
    </div>
  )
}
