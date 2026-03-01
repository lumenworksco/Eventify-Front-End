'use client';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const stored = localStorage.getItem('eventify_theme');
    if (stored === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('eventify_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('eventify_theme', 'light');
    }
  };

  return (
    <div className="site-wrap">
      <div className="container">
        <header className="site-header">
          <Link href="/" className="logo" style={{ alignItems: 'center', textDecoration: 'none' }}>
            <div className="logo-mark">E</div>
            <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Eventify</span>
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              <li>
                <Link href="/">{t('nav.home')}</Link>
              </li>
              <li>
                <Link href="/events">{t('nav.events')}</Link>
              </li>
              <li>
                <Link href="/venues">{t('nav.venues')}</Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link href="/profile">{t('nav.profile')}</Link>
                </li>
              )}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              title={darkMode ? 'Light mode' : 'Dark mode'}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

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

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo" style={{ marginBottom: 8 }}>
                <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 13 }}>E</div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Eventify</span>
              </div>
              <p className="muted small" style={{ maxWidth: 260 }}>
                {t('footer.description')}
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">{t('footer.explore')}</h4>
              <nav className="footer-links">
                <Link href="/events">{t('nav.events')}</Link>
                <Link href="/venues">{t('nav.venues')}</Link>
              </nav>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">{t('footer.account')}</h4>
              <nav className="footer-links">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile">{t('nav.profile')}</Link>
                    <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit', textAlign: 'left' }}>
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">{t('nav.login')}</Link>
                    <Link href="/register">{t('nav.register')}</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
            <span className="muted">{t('footer.tagline')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
