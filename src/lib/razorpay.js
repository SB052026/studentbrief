export function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function initiatePayment({
  amount,
  orderId,
  description,
  prefillName,
  prefillEmail,
  prefillContact,
  onSuccess,
  onFailure,
}) {
  const loaded = await loadRazorpay()
  if (!loaded) {
    alert('Razorpay load nahi hua. Internet check karo.')
    return
  }
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: 'INR',
    name: 'StudentBrief',
    description: description,
    order_id: orderId,
    prefill: {
      name: prefillName || '',
      email: prefillEmail || '',
      contact: prefillContact || '',
    },
    theme: { color: '#1a3c8f' },
    handler: function (response) { onSuccess(response) },
    modal: { ondismiss: function () { if (onFailure) onFailure() } },
  }
  const razorpay = new window.Razorpay(options)
  razorpay.open()
}
