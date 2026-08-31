const CACHE_NAME = 'sb-v3'
const STATIC_CACHE = 'sb-static-v3'
const API_CACHE = 'sb-api-v3'

const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/logo.png',
  '/manifest.json',
  '/jobs',
  '/results',
  '/admitcard',
  '/answerkey',
  '/syllabus',
]

// Install - cache static files
self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {})
    })
  )
})

// Activate - delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => ![CACHE_NAME, STATIC_CACHE, API_CACHE].includes(key))
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Skip non-GET
  if (event.request.method !== 'GET') return

  // Skip admin/operator pages - always fresh
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/operator')) return

  // Supabase API - network first, cache fallback (5 min cache)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(API_CACHE).then(cache => {
              cache.put(event.request, clone)
              // Auto expire after 5 minutes
              setTimeout(() => cache.delete(event.request), 5 * 60 * 1000)
            })
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Static assets - cache first
  if (
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|css|js)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then(cache => cache.put(event.request, clone))
          }
          return response
        }).catch(() => cached)
      })
    )
    return
  }

  // Pages - network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => caches.match(event.request))
  )
})

// Listen for update message
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting()
})
