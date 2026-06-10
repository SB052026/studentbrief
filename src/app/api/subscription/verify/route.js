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

    const { orderId, paymentId, signature } = await request.json()

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan: 'monthly',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      payment_id: paymentId,
      status: 'active',
    })

    if (error) {
      return NextResponse.json({ error: 'Subscription save nahi hui' }, { status: 500 })
    }

    await supabase
      .from('users')
      .update({ subscription_status: 'active' })
      .eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscription verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
