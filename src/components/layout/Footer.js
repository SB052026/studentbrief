import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a3c8f' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3">
              Student<span style={{ color: '#f97316' }}>Brief</span>
            </h3>
            <p className="text-blue-200 text-sm">
              Latest Govt Jobs, Results, Mock Tests, Previous Year Papers and Live Tests for students.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-orange-400">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-blue-200">
              <li><Link href="/jobs" className="hover:text-white transition">Latest Jobs</Link></li>
              <li><Link href="/results" className="hover:text-white transition">Latest Results</Link></li>
              <li><Link href="/dashboard/mock-test" className="hover:text-white transition">Mock Test</Link></li>
              <li><Link href="/dashboard/pyp" className="hover:text-white transition">Previous Year Papers</Link></li>
              <li><Link href="/dashboard/live-test" className="hover:text-white transition">Live Test</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-orange-400">Contact</h4>
            <ul className="flex flex-col gap-2 text-sm text-blue-200">
              <li>Email: support@studentbrief.in</li>
              <li>Website: studentbrief.in</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-sm text-blue-300">
          © 2025 StudentBrief.in — All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
