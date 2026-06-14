'use client'

import { useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { initiatePayment } from '@/lib/razorpay'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/Loader'

export default function SubscribePage() {
  const { user, dbUser, loading } = useUser()
  const [paying, setPaying] = useState(false)
  const router = useRouter()

  async function handleSubscribe() {
    if (!user) return
    setPaying(true)
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const { orderId } = await res.json()

      await initiatePayment({
        amount: 29,
        orderId,
        description: 'StudentBrief Monthly Subscription',
        prefillName: dbUser?.name || '',
        prefillEmail: dbUser?.email || '',
        prefillContact: dbUser?.mobile || '',
        onSuccess: async (response) => {
          const verifyRes = await fetch('/api/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })
          const data = await verifyRes.json()
          if (data.success) {
            router.push('/dashboard')
          }
        },
        onFailure: () => {
          setPaying(false)
        },
      })
    } catch (err) {
      console.error(err)
    }
    setPaying(false)
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <span className="text-6xl mb-6 block">📚</span>
      <h1 className="text-2xl font-bold text-blue-900 mb-2">
        StudentBrief Subscription
      </h1>
      <p className="text-gray-500 mb-8">
        Mock Test + Previous Year Papers unlock karo
      </p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-sm mx-auto mb-8">
        <div className="text-4xl font-bold text-blue-900 mb-1">
          ₹29<span className="text-lg font-normal text-gray-500">/month</span>
        </div>
        <p className="text-green-600 font-semibold mb-6 text-sm">
          7 Din Free Trial ke baad
        </p>
        <ul className="text-left text-sm flex flex-col gap-3 mb-6">
          <li className="flex items-center gap-2">
            <span className="text-green-500 font-bold">✓</span>
            Unlimited Mock Tests
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500 font-bold">✓</span>
            All Previous Year Papers
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500 font-bold">✓</span>
            Detailed Solutions
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500 font-bold">✓</span>
            Performance Analysis
          </li>
        </ul>
        <button
          onClick={handleSubscribe}
          disabled={paying}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
        >
          {paying ? 'Processing...' : '₹29 Pay Karo aur Subscribe Karo'}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Secure payment by Razorpay • Cancel anytime
      </p>
    </div>
  )
}
