'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ORGANIZER'>('USER');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t('validation.usernameRequired'));
      return;
    }
    if (name.trim().length < 3) {
      setError(t('validation.usernameMinLength'));
      return;
    }
    if (!password.trim()) {
      setError(t('validation.passwordRequired'));
      return;
    }
    if (password.length < 6) {
      setError(t('validation.passwordMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('validation.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(name.trim(), password, role);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || t('register.error'));
      }
    } catch (err) {
      setError(t('register.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2>{t('register.title')}</h2>
          <p className="muted">{t('register.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">{t('register.username')} *</label>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('register.usernamePlaceholder')}
              disabled={isSubmitting}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('register.password')} *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              disabled={isSubmitting}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('register.confirmPassword')} *</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('register.confirmPasswordPlaceholder')}
              disabled={isSubmitting}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('register.accountType')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setRole('USER')}
                disabled={isSubmitting}
                className={`btn btn-full ${role === 'USER' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t('register.roleUser')}
              </button>
              <button
                type="button"
                onClick={() => setRole('ORGANIZER')}
                disabled={isSubmitting}
                className={`btn btn-full ${role === 'ORGANIZER' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {t('register.roleOrganizer')}
              </button>
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              {role === 'USER'
                ? t('register.userDesc')
                : t('register.organizerDesc')}
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('register.submitting') : t('register.submit')}
          </button>

          <div className="auth-footer">
            <p>
              {t('register.haveAccount')}{' '}
              <Link href="/login">{t('register.loginLink')}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
