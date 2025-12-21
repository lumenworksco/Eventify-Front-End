'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    if (!name.trim()) {
      setError(t('validation.usernameRequired'));
      return;
    }
    if (!password.trim()) {
      setError(t('validation.passwordRequired'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(name.trim(), password);
      
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || t('login.error'));
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <h2>{t('login.title')}</h2>
        <p className="muted">{t('login.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: 400 }}>
        {error && (
          <div style={{ 
            color: '#ef4444', 
            backgroundColor: '#fef2f2', 
            padding: '0.75rem', 
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" htmlFor="username">{t('login.username')} *</label>
          <input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('login.username')}
            disabled={isSubmitting}
            autoComplete="username"
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" htmlFor="password">{t('login.password')} *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.password')}
            disabled={isSubmitting}
            autoComplete="current-password"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? t('login.submitting') : t('login.submit')}
        </button>

        <div style={{ marginTop: '1.5rem' }}>
          <p className="small muted" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{t('login.demoAccounts')}:</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e6edf3' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>{t('login.username')}</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>{t('login.password')}</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>{t('login.role')}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e6edf3' }}>
                <td style={{ padding: '0.5rem' }}>john</td>
                <td style={{ padding: '0.5rem' }}>john123</td>
                <td style={{ padding: '0.5rem' }}>{t('login.roleUser')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e6edf3' }}>
                <td style={{ padding: '0.5rem' }}>jane</td>
                <td style={{ padding: '0.5rem' }}>jane123</td>
                <td style={{ padding: '0.5rem' }}>{t('login.roleOrganizer')}</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem' }}>admin</td>
                <td style={{ padding: '0.5rem' }}>admin123</td>
                <td style={{ padding: '0.5rem' }}>{t('login.roleAdmin')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e6edf3', textAlign: 'center' }}>
          <p className="small muted">
            {t('login.noAccount')} <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('login.registerLink')}</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
