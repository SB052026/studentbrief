import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, paymentId, signature, testId, userId } = await request.json()

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const { error } = await supabase.from('live_payments').insert({
      user_id: userId,
      test_id: testId,
      payment_id: paymentId,
      order_id: orderId,
      status: 'paid',
    })

    if (error) {
      return NextResponse.json({ error: 'Payment save nahi hua' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
