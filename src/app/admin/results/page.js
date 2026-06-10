'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

const emptyResult = {
  title: '',
  category_id: '',
  published_date: '',
  exam_date: '',
  result_date: '',
  organization: '',
  post_name: '',
  total_vacancies: '',
  result_status: 'Awaited',
  result_link: '',
}

export default function AdminResultsPage() {
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editResult, setEditResult] = useState(null)
  const [form, setForm] = useState(emptyResult)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function fetchData() {
    const supabase = createClient()
    const { data: resultsData } = await supabase
      .from('results')
      .select('*, result_categories(name)')
      .order('created_at', { ascending: false })
    const { data: catsData } = await supabase
      .from('result_categories')
      .select('*')
      .order('name')
    setResults(resultsData || [])
    setCategories(catsData || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function handleEdit(result) {
    setEditResult(result)
    setForm({
      title: result.title || '',
      category_id: result.category_id || '',
      published_date: result.published_date || '',
      exam_date: result.exam_date || '',
      result_date: result.result_date || '',
      organization: result.organization || '',
      post_name: result.post_name || '',
      total_vacancies: result.total_vacancies || '',
      result_status: result.result_status || 'Awaited',
      result_link: result.result_link || '',
    })
    setShowForm(true)
  }

  function handleAdd() {
    setEditResult(null)
    setForm(emptyResult)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title || !form.category_id) {
      setError('Title aur Category zaroori hai')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const payload = {
      ...form,
      total_vacancies: parseInt(form.total_vacancies) || null,
      exam_date: form.exam_date || null,
      result_date: form.result_date || null,
    }
    if (editResult) {
      await supabase.from('results').update(payload).eq('id', editResult.id)
    } else {
      await supabase.from('results').insert(payload)
    }
    await fetchData()
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('results').delete().eq('id', id)
    await fetchData()
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Results Manage Karo</h1>
        <button
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Naya Result Add Karo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="font-bold text-blue-900 mb-4">
            {editResult ? 'Result Edit Karo' : 'Naya Result Add Karo'}
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Result Title *</label>
              <input
                className="input-field"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Result title daalo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
              <select
                className="input-field"
                value={form.category_id}
                onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
              >
                <option value="">Category select karo</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Result Status</label>
              <select
                className="input-field"
                value={form.result_status}
                onChange={e => setForm(p => ({ ...p, result_status: e.target.value }))}
              >
                <option value="Awaited">Awaited</option>
                <option value="Declared">Declared</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Published Date</label>
              <input type="date" className="input-field" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Exam Date</label>
              <input type="date" className="input-field" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Result Date</label>
              <input type="date" className="input-field" value={form.result_date} onChange={e => setForm(p => ({ ...p, result_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Organization</label>
              <input className="input-field" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Organization name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Post Name</label>
              <input className="input-field" value={form.post_name} onChange={e => setForm(p => ({ ...p, post_name: e.target.value }))} placeholder="Post name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Total Vacancies</label>
              <input type="number" className="input-field" value={form.total_vacancies} onChange={e => setForm(p => ({ ...p, total_vacancies: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Result Link</label>
              <input className="input-field" value={form.result_link} onChange={e => setForm(p => ({ ...p, result_link: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
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

      {results.length > 0 ? (
        <div className="flex flex-col gap-3">
          {results.map(result => (
            <div key={result.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{result.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {result.result_categories?.name} •
                  <span className={`ml-1 font-medium ${result.result_status === 'Declared' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.result_status}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(result)}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(result.id)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Koi result nahi hai" description="Naya result add karo" icon="📋" />
      )}
    </div>
  )
}
