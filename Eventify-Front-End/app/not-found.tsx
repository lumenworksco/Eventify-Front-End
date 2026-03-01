'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: 800,
        lineHeight: 1,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 8,
      }}>
        404
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        {t('notFound.title')}
      </h2>
      <p className="muted" style={{ fontSize: 16, marginBottom: 32, maxWidth: 400 }}>
        {t('notFound.message')}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/" className="btn btn-primary btn-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {t('nav.home')}
        </Link>
        <Link href="/events" className="btn btn-ghost btn-lg">
          {t('common.browseEvents')}
        </Link>
      </div>
    </div>
  );
}
