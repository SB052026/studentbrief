export default function Badge({ type, text }) {
  const styles = {
    trial: 'badge-trial',
    active: 'badge-active',
    expired: 'badge-expired',
    upcoming: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold',
    ongoing: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold',
    completed: 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold',
    declared: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold',
    awaited: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold',
    paid: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold',
    pending: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold',
    delivered: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold',
  }

  return (
    <span className={styles[type] || styles.pending}>
      {text}
    </span>
  )
}
