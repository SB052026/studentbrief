'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState('gmail')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleSendOtp() {
    if (!phone || phone.length < 10) {
      setError('Sahi mobile number daalo')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    })
    if (error) {
      setError(error.message)
    } else {
      setOtpSent(true)
    }
    setLoading(false)
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 4) {
      setError('Sahi OTP daalo')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: 'sms',
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#f8fafc' }}>
      <Link href="/" className="text-2xl font-bold mb-8">
        Student<span style={{ color: '#f97316' }}>Brief</span>
      </Link>

      <div className="card w-full max-w-md">
        <h1 className="text-xl font-bold text-center text-blue-900 mb-2">Login / Sign Up</h1>
        <p className="text-sm text-gray-500 text-center mb-6">StudentBrief me welcome hai</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('gmail'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'gmail' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Gmail se Login
          </button>
          <button
            onClick={() => { setMode('phone'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'phone' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Mobile se Login
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {mode === 'gmail' && (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-blue-400 py-3 rounded-lg font-medium transition"
          >
            <span className="text-xl">G</span>
            {loading ? 'Loading...' : 'Google se Login karo'}
          </button>
        )}

        {mode === 'phone' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 digit number"
                  className="input-field flex-1"
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition"
              >
                {loading ? 'Sending...' : 'OTP Bhejo'}
              </button>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">OTP</label>
                  <input
                    type="tel"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="OTP daalo"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition"
                >
                  {loading ? 'Verifying...' : 'Verify karo aur Login karo'}
                </button>
                <button
                  onClick={() => { setOtpSent(false); setOtp('') }}
                  className="text-sm text-blue-600 hover:underline text-center"
                >
                  Number badlo
                </button>
              </>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          Login karke aap StudentBrief ki Terms aur Privacy Policy se agree karte ho
        </p>
      </div>
    </div>
  )
}
