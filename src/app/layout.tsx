import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'

const geist = Geist({
  subsets:      ['latin', 'latin-ext'],   // Polskie znaki
  display:      'swap',                   // Zabezpiecza przed FOIT i CLS
  preload:      true,
  variable:     '--font-sans',
})

const geistMono = Geist_Mono({
  subsets:      ['latin', 'latin-ext'],
  display:      'swap',
  preload:      true,
  variable:     '--font-mono',
})

export const metadata: Metadata = {
  title: 'TechTrends.pl — Największa baza wiedzy o technologiach',
  description: 'Zarobki, trendy popularności i roadmapy kariery IT w Polsce.',
  alternates: {
    canonical: 'https://techtrends.pl',
    languages: { 'pl': 'https://techtrends.pl', 'x-default': 'https://techtrends.pl' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Preconnect for external web fonts if any left */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {/* Skip link for Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only skip-link" style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: '#00e5a0', color: '#000', zIndex: 9999 }}>
          Przejdź do głównej treści
        </a>
        
        {/* Główny kontener oznaczony id="main-content" */}
        <div className="flex flex-col min-h-screen">
            {/* Tutaj Navbar */}
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            {/* Tutaj Footer */}
        </div>
      </body>
    </html>
  )
}
