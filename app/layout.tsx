import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import './globals.css'
import './theme.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'MRJOO World | بث مباشر وهدايا',
  description: 'منصة MRJOO World للبث المباشر وإرسال الهدايا والشحن عبر فودافون كاش',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1024',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.className} min-h-dvh bg-background text-foreground antialiased`}>
        <SiteHeader />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
