import './globals.css'
import { UserProvider } from '@/components/UserProvider'

export const metadata = {
  title: 'StudentBrief - Latest Jobs, Results & Tests',
  description: 'StudentBrief.in - Latest Govt Jobs, Results, Mock Tests, Previous Year Papers for students.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
