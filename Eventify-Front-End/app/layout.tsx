import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Eventify — Discover Live Events in Belgium',
    template: '%s | Eventify',
  },
  description: 'Discover concerts, comedy, film and community events at venues across Belgian cities. Browse, explore, and add your own events.',
  keywords: ['events', 'belgium', 'concerts', 'venues', 'tickets', 'live events', 'brussels', 'antwerp'],
  authors: [{ name: 'Eventify Team' }],
  openGraph: {
    title: 'Eventify — Discover Live Events in Belgium',
    description: 'Find concerts, comedy, film and community events at venues across Belgian cities.',
    type: 'website',
    locale: 'en_BE',
    siteName: 'Eventify',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventify — Discover Live Events in Belgium',
    description: 'Find concerts, comedy, film and community events at venues across Belgian cities.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
