const CACHE_NAME = 'studentbrief-v2'
const STATIC_CACHE = [
  '/',
  '/favicon.png',
  '/logo.png',
  '/manifest.json',
]

// Install - cache static files
self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE))
  )
})

// Activate - delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

// Fetch - network first, cache fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip API/Supabase calls - always fresh
  if (event.request.url.includes('supabase.co') ||
      event.request.url.includes('/api/') ||
      event.request.url.includes('_next/data')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request)
      })
  )
})

// Listen for update message
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
})
