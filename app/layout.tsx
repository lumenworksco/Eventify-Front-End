import type { ReactNode } from 'react';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import './globals.css';

export const metadata = {
  title: 'Eventify',
  description: 'Eventify — browse venues and events',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
