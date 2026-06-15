'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { initiatePayment } from '@/lib/razorpay'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import { useRouter } from 'next/navigation'

export default function LiveTestDetailPage({ params }) {
  const { user, dbUser, loading: userLoading } = useUser()
  const [test, setTest] = useState(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)
  const [testId, setTestId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setTestId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!testId || !user) return
    async function fetchTest() {
      const supabase = createClient()
      const { data: testData } = await supabase
        .from('live_tests')
        .select('*')
        .eq('id', testId)
        .single()
      setTest(testData)

      const { data: payment } = await supabase
        .from('live_payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('test_id', testId)
        .eq('status', 'paid')
        .single()
      setHasPaid(!!payment)
      setLoading(false)
    }
    fetchTest()
  }, [testId, user])

  async function handlePayment() {
    if (!user || !test) return
    setPayLoading(true)
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: test.fee, testId: test.id }),
      })
      const { orderId } = await res.json()

      await initiatePayment({
        amount: test.fee,
        orderId,
        description: `Live Test: ${test.title}`,
        prefillName: dbUser?.name || '',
        prefillEmail: dbUser?.email || '',
        prefillContact: dbUser?.mobile || '',
        onSuccess: async (response) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              testId: test.id,
              userId: user.id,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            setHasPaid(true)
          }
        },
        onFailure: () => {
          setPayLoading(false)
        },
      })
    } catch (err) {
      console.error(err)
    }
    setPayLoading(false)
  }

  if (loading) return <Loader />

  if (!test) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Test nahi mila</h2>
        <Link href="/dashboard/live-test" className="text-blue-600 hover:underline mt-2 block">
          Wapas Live Tests pe jao
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/dashboard/live-test" className="text-blue-600 hover:underline text-sm mb-6 block">
        ← Wapas Live Tests pe jao
      </Link>

      <div className="card">
        <div className="flex items-start justify-between mb-4 pb-4 border-b">
          <h1 className="text-xl font-bold text-blue-900">{test.title}</h1>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ml-2 shrink-0 ${
            test.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            test.status === 'ongoing' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {test.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Test Date</p>
            <p className="font-semibold text-sm">{formatDate(test.test_date)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Duration</p>
            <p className="font-semibold text-sm">{test.duration_minutes} minutes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Questions</p>
            <p className="font-semibold text-sm">{test.total_questions}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Entry Fee</p>
            <p className="font-semibold text-sm text-orange-600">₹{test.fee}</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">🏆 Rewards</h3>
          <p className="text-blue-700 text-xs">Top students ko books, laptops aur aur bhi prizes milenge. Leaderboard me apni position dekho!</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2 text-sm">⚠️ Important Rules</h3>
          <ul className="text-yellow-700 text-xs flex flex-col gap-1">
            <li>• Camera, Mic aur Location access required hai</li>
            <li>• Fullscreen me rehna zaroori hai</li>
            <li>• Tab switch karna allowed nahi (3 baar baad auto submit)</li>
            <li>• Face camera me dikhna chahiye hamesha</li>
            <li>• Copy paste allowed nahi</li>
            <li>• Ek device pe sirf ek session allowed hai</li>
          </ul>
        </div>

        {hasPaid ? (
          <Link
            href={`/dashboard/live-test/${test.id}/exam`}
            className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg transition text-lg"
          >
            Test Shuru Karo →
          </Link>
        ) : (
          <button
            onClick={handlePayment}
            disabled={payLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition text-lg"
          >
            {payLoading ? 'Processing...' : `₹${test.fee} Pay Karo aur Join Karo`}
          </button>
        )}

        <div className="mt-4 text-center">
          <Link
            href={`/dashboard/live-test/${test.id}/leaderboard`}
            className="text-sm text-blue-600 hover:underline"
          >
            Leaderboard Dekho →
          </Link>
        </div>
      </div>
    </div>
  )
}
