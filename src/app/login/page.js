import { redirect } from 'next/navigation'

export default function LoginPage() {
  redirect('/')
}

export const metadata = {
  robots: 'noindex, nofollow',
}
