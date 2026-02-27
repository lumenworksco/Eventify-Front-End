'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="site-wrap">
      <div className="container">
        <header className="site-header">
          <div className="logo" style={{ alignItems: 'center' }}>
            <div className="logo-mark">E</div>
            <h1 style={{ margin: 0 }}>Eventify</h1>
          </div>

          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              <li>
                <Link href="/">{t('nav.home')}</Link>
              </li>
              <li>
                <Link href="/events">{t('nav.events')}</Link>
              </li>
              {/* Only show Add Event to ADMIN and ORGANIZER roles */}
              {isAuthenticated && hasRole(['ADMIN', 'ORGANIZER']) && (
                <li className="nav-cta">
                  <Link href="/events/new">{t('nav.addEvent')}</Link>
                </li>
              )}
              {/* Only show Add Venue to ADMIN role */}
              {isAuthenticated && hasRole(['ADMIN']) && (
                <li className="nav-cta">
                  <Link href="/venue/new">{t('nav.addVenue')}</Link>
                </li>
              )}
            </ul>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSelector />
            
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link href="/profile" className="small" style={{ textDecoration: 'none' }}>
                  {t('nav.welcome', { name: user?.name || '' })}
                  {user?.role && (
                    <span 
                      className="muted" 
                      style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.75rem',
                        backgroundColor: user.role === 'ADMIN' ? '#fef3c7' : '#e0e7ff',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {user.role}
                    </span>
                  )}
                </Link>
                <button 
                  onClick={logout} 
                  className="btn btn-ghost"
                  style={{ padding: '0.25rem 0.75rem' }}
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link href="/login" className="btn btn-ghost">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="btn btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </header>
      </div>

      <main style={{ flex: 1 }}>
        <div className="container">{children}</div>
      </main>

      <footer className="site-footer container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div className="small">{t('footer.copyright', { year: new Date().getFullYear() })}</div>
          <div className="small u-muted">{t('footer.tagline')}</div>
        </div>
      </footer>
    </div>
  );
}
