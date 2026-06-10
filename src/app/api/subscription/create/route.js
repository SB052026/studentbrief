import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await razorpay.orders.create({
      amount: 29 * 100,
      currency: 'INR',
      receipt: `subscription_${user.id}`,
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Subscription order error:', error)
    return NextResponse.json({ error: 'Order create nahi hua' }, { status: 500 })
  }
}
