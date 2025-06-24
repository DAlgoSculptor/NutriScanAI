import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NutriScan AI - Smart Ingredient Scanner',
  description: 'Instantly analyze food ingredients with AI-powered technology. Detect harmful substances, understand health impacts, and make informed decisions about what you consume.',
  keywords: 'ingredient analysis, food safety, AI scanner, nutrition, health, food ingredients, harmful substances',
  authors: [{ name: 'NutriScan AI Team' }],
  creator: 'NutriScan AI',
  publisher: 'NutriScan AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nutriscan-ai.com'),
  openGraph: {
    title: 'NutriScan AI - Smart Ingredient Scanner',
    description: 'AI-powered ingredient analysis for healthier food choices',
    url: 'https://nutriscan-ai.com',
    siteName: 'NutriScan AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NutriScan AI - Smart Ingredient Scanner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriScan AI - Smart Ingredient Scanner',
    description: 'AI-powered ingredient analysis for healthier food choices',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
