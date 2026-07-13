import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = await createClient()
  const baseUrl = 'https://www.studentbrief.in'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/results`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/answerkey`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/admitcard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/syllabus`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/dashboard/mock-test`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dashboard/pyp`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dashboard/subject-mock`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Dynamic jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at, job_categories(slug)')
    .order('created_at', { ascending: false })

  const jobPages = (jobs || []).map(job => ({
    url: `${baseUrl}/jobs/${job.job_categories?.slug}/${job.id}`,
    lastModified: new Date(job.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic results
  const { data: results } = await supabase
    .from('results')
    .select('id, updated_at, result_categories(slug)')
    .order('created_at', { ascending: false })

  const resultPages = (results || []).map(r => ({
    url: `${baseUrl}/results/${r.result_categories?.slug}/${r.id}`,
    lastModified: new Date(r.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dynamic answer keys
  const { data: answerkeys } = await supabase
    .from('answerkeys')
    .select('id, updated_at, answerkey_categories(slug)')

  const answerKeyPages = (answerkeys || []).map(ak => ({
    url: `${baseUrl}/answerkey/${ak.answerkey_categories?.slug}/${ak.id}`,
    lastModified: new Date(ak.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Dynamic admit cards
  const { data: admitcards } = await supabase
    .from('admitcards')
    .select('id, updated_at, admitcard_categories(slug)')

  const admitCardPages = (admitcards || []).map(ac => ({
    url: `${baseUrl}/admitcard/${ac.admitcard_categories?.slug}/${ac.id}`,
    lastModified: new Date(ac.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...jobPages,
    ...resultPages,
    ...answerKeyPages,
    ...admitCardPages,
  ]
}
