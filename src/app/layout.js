import './globals.css'
import { UserProvider } from '@/components/UserProvider'
import FeedbackPopup from '@/components/FeedbackPopup'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value').in('key', ['meta_title', 'meta_description', 'meta_keywords', 'site_name'])
    const settings = {}
    data?.forEach(s => { settings[s.key] = s.value })
    return {
      title: settings.meta_title || 'StudentBrief - Latest Govt Jobs, Results & Mock Tests',
      description: settings.meta_description || 'Latest Govt Jobs, Results, Mock Tests, Previous Year Papers for students.',
      keywords: settings.meta_keywords || 'govt jobs, ssc, railway, bank jobs, results, mock test',
      icons: {
        icon: [{ url: '/favicon.png', type: 'image/png' }],
        apple: '/favicon.png',
        shortcut: '/favicon.png',
      },
      openGraph: {
        title: settings.meta_title || 'StudentBrief - Latest Govt Jobs, Results & Mock Tests',
        description: settings.meta_description || 'Latest Govt Jobs, Results, Mock Tests, Previous Year Papers for students.',
        url: 'https://www.studentbrief.in',
        siteName: 'StudentBrief',
        images: [{ url: 'https://www.studentbrief.in/og-image.png', width: 1200, height: 630, alt: 'StudentBrief' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.meta_title || 'StudentBrief',
        description: settings.meta_description || 'Latest Govt Jobs, Results & Mock Tests',
        images: ['https://www.studentbrief.in/og-image.png'],
      },
    }
  } catch {
    return {
      title: 'StudentBrief - Latest Govt Jobs, Results & Mock Tests',
      description: 'Latest Govt Jobs, Results, Mock Tests, Previous Year Papers for students.',
      icons: { icon: '/favicon.png', apple: '/favicon.png' },
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://baccijzgsxiuyuyiqdgm.supabase.co" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#1a3c8f" />
        <meta name="google-site-verification" content="TQe_MyZe7zp3Ipq3ybuzUO2avSP_N5fm-fvTxZW-gQM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="StudentBrief" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(reg) {
                // Check for updates every 60 seconds
                setInterval(function() { reg.update(); }, 60000);
                
                reg.addEventListener('updatefound', function() {
                  var newWorker = reg.installing;
                  newWorker.addEventListener('statechange', function() {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      // New update available - auto activate
                      newWorker.postMessage('skipWaiting');
                    }
                  });
                });

                // Reload when new SW takes control
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  window.location.reload();
                });
              });
            });
          }
        `}} />
      </head>
      <body>
        <UserProvider>
          {children}
          <FeedbackPopup />
          <Analytics />
          <SpeedInsights />
        </UserProvider>
      </body>
    </html>
  )
}
