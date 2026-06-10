export function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function isTrialActive(trialStart) {
  if (!trialStart) return false
  const trialEnd = new Date(trialStart)
  trialEnd.setDate(trialEnd.getDate() + 7)
  return new Date() < trialEnd
}

export function getTrialDaysLeft(trialStart) {
  if (!trialStart) return 0
  const trialEnd = new Date(trialStart)
  trialEnd.setDate(trialEnd.getDate() + 7)
  const diff = trialEnd - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function isSubscriptionActive(subscription) {
  if (!subscription) return false
  if (subscription.status !== 'active') return false
  return new Date() < new Date(subscription.end_date)
}

export function hasAccessToContent(user, subscription) {
  if (!user) return false
  if (isTrialActive(user.trial_start)) return true
  if (isSubscriptionActive(subscription)) return true
  return false
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function calculateScore(questions, answers) {
  let score = 0
  questions.forEach((question) => {
    if (answers[question.id] === question.correct_option) {
      score++
    }
  })
  return score
}

export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
