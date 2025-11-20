import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { CardlectProvider } from '@/contexts/cardlect-context'
import MobilePopup from '@/components/mobile-checker'
import './globals.css'

// Load Inter and Montserrat and expose them as CSS variables
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })

export const metadata: Metadata = {
  title: 'Cardlect | The Smart Card System',
  description: 'Enterprise-grade card management system',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-inter), var(--font-montserrat), sans-serif' }}
      >
        <ThemeProvider>
          <CardlectProvider>
          <MobilePopup />
          {children}
          </CardlectProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
