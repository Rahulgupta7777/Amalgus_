import type { Metadata } from 'next'
import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { RoleProvider } from '@/context/RoleContext'
import { EstimateCartProvider } from '@/context/EstimateCartContext'
import { Navbar } from '@/components/Navbar'
import { ToastProvider } from '@/components/neumorphic/Toast'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AmalGus — Glass & Allied Products Marketplace',
  description:
    "India's first intelligent B2B2C glass marketplace. Discover, compare, and estimate glass products from verified suppliers.",
  keywords: ['glass', 'marketplace', 'tempered', 'laminated', 'IGU', 'suppliers', 'India'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <RoleProvider>
          <EstimateCartProvider>
            <ToastProvider>
              <Navbar />
            <main style={{ minHeight: '100vh' }}>
              <div
                style={{
                  maxWidth: '1280px',
                  margin: '0 auto',
                  padding: '12px 20px 60px',
                }}
              >
                {children}
              </div>
            </main>
            </ToastProvider>
          </EstimateCartProvider>
        </RoleProvider>
      </body>
    </html>
  )
}
