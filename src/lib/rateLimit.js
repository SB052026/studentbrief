// Simple rate limiting using Supabase
const attempts = {}

export function checkRateLimit(key, maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  
  if (!attempts[key]) {
    attempts[key] = { count: 1, firstAttempt: now }
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  const data = attempts[key]
  
  // Reset if window expired
  if (now - data.firstAttempt > windowMs) {
    attempts[key] = { count: 1, firstAttempt: now }
    return { allowed: true, remaining: maxAttempts - 1 }
  }

  // Check if exceeded
  if (data.count >= maxAttempts) {
    const resetIn = Math.ceil((data.firstAttempt + windowMs - now) / 1000 / 60)
    return { allowed: false, remaining: 0, resetIn }
  }

  data.count++
  return { allowed: true, remaining: maxAttempts - data.count }
}

export function resetRateLimit(key) {
  delete attempts[key]
}
