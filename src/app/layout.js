import './globals.css'

export const metadata = {
  title: 'StudentBrief - Latest Jobs, Results & Tests',
  description: 'StudentBrief.in - Latest Govt Jobs, Results, Mock Tests, Previous Year Papers and Live Tests for students.',
  keywords: 'govt jobs, results, mock test, previous year papers, live test, studentbrief',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
