export default function EmptyState({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8">
      <div className="text-5xl mb-4">{icon || '📭'}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title || 'Koi data nahi mila'}
      </h3>
      <p className="text-sm text-gray-500">
        {description || 'Abhi koi data available nahi hai.'}
      </p>
    </div>
  )
}
