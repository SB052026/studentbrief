'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

const emptyJob = {
  title: '',
  category_id: '',
  published_date: '',
  last_date: '',
  exam_date: '',
  physical_date: '',
  medical_date: '',
  age_min: '',
  age_max: '',
  education: '',
  documents: '',
  physical_measurements: '',
  medical_criteria: '',
  apply_link: '',
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [form, setForm] = useState(emptyJob)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function fetchData() {
    const supabase = createClient()
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*, job_categories(name)')
      .order('created_at', { ascending: false })
    const { data: catsData } = await supabase
      .from('job_categories')
      .select('*')
      .order('name')
    setJobs(jobsData || [])
    setCategories(catsData || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function handleEdit(job) {
    setEditJob(job)
    setForm({
      title: job.title || '',
      category_id: job.category_id || '',
      published_date: job.published_date || '',
      last_date: job.last_date || '',
      exam_date: job.exam_date || '',
      physical_date: job.physical_date || '',
      medical_date: job.medical_date || '',
      age_min: job.age_min || '',
      age_max: job.age_max || '',
      education: job.education || '',
      documents: job.documents || '',
      physical_measurements: job.physical_measurements || '',
      medical_criteria: job.medical_criteria || '',
      apply_link: job.apply_link || '',
    })
    setShowForm(true)
  }

  function handleAdd() {
    setEditJob(null)
    setForm(emptyJob)
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
      age_min: parseInt(form.age_min) || null,
      age_max: parseInt(form.age_max) || null,
      exam_date: form.exam_date || null,
      physical_date: form.physical_date || null,
      medical_date: form.medical_date || null,
    }
    if (editJob) {
      await supabase.from('jobs').update(payload).eq('id', editJob.id)
    } else {
      await supabase.from('jobs').insert(payload)
    }
    await fetchData()
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('jobs').delete().eq('id', id)
    await fetchData()
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Jobs Manage Karo</h1>
        <button
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Naya Job Add Karo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="font-bold text-blue-900 mb-4">
            {editJob ? 'Job Edit Karo' : 'Naya Job Add Karo'}
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Job Title *</label>
              <input
                className="input-field"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Job title daalo"
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
              <label className="text-sm font-medium text-gray-700 block mb-1">Apply Link</label>
              <input
                className="input-field"
                value={form.apply_link}
                onChange={e => setForm(p => ({ ...p, apply_link: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Published Date</label>
              <input type="date" className="input-field" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Last Date</label>
              <input type="date" className="input-field" value={form.last_date} onChange={e => setForm(p => ({ ...p, last_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Exam Date</label>
              <input type="date" className="input-field" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Physical Date</label>
              <input type="date" className="input-field" value={form.physical_date} onChange={e => setForm(p => ({ ...p, physical_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Medical Date</label>
              <input type="date" className="input-field" value={form.medical_date} onChange={e => setForm(p => ({ ...p, medical_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Min Age</label>
              <input type="number" className="input-field" value={form.age_min} onChange={e => setForm(p => ({ ...p, age_min: e.target.value }))} placeholder="18" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Max Age</label>
              <input type="number" className="input-field" value={form.age_max} onChange={e => setForm(p => ({ ...p, age_max: e.target.value }))} placeholder="35" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Education</label>
              <input className="input-field" value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))} placeholder="Education qualification" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Documents</label>
              <input className="input-field" value={form.documents} onChange={e => setForm(p => ({ ...p, documents: e.target.value }))} placeholder="Required documents" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Physical Measurements</label>
              <input className="input-field" value={form.physical_measurements} onChange={e => setForm(p => ({ ...p, physical_measurements: e.target.value }))} placeholder="Height, chest, weight" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Medical Criteria</label>
              <input className="input-field" value={form.medical_criteria} onChange={e => setForm(p => ({ ...p, medical_criteria: e.target.value }))} placeholder="Medical requirements" />
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

      {jobs.length > 0 ? (
        <div className="flex flex-col gap-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{job.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {job.job_categories?.name} • Last Date: {formatDate(job.last_date)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(job)}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Koi job nahi hai" description="Naya job add karo" icon="💼" />
      )}
    </div>
  )
}
