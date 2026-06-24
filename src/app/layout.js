import './globals.css'
import { UserProvider } from '@/components/UserProvider'

export const metadata = {
  title: 'StudentBrief - Latest Jobs, Results & Tests',
  description: 'StudentBrief.in - Latest Govt Jobs, Results, Mock Tests, Previous Year Papers for students.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
