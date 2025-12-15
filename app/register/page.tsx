'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // Redirect if already logged in
  if (isAuthenticated) {
    router.push('/');
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
      const result = await register(name.trim(), password);
      
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <h2>{t('register.title')}</h2>
        <p className="muted">{t('register.subtitle')}</p>
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
          <label className="small" htmlFor="username">{t('register.username')} *</label>
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

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" htmlFor="password">{t('register.password')} *</label>
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

        <div style={{ marginBottom: '1rem' }}>
          <label className="small" htmlFor="confirmPassword">{t('register.confirmPassword')} *</label>
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

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? t('register.submitting') : t('register.submit')}
        </button>

        <div className="small muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>{t('register.haveAccount')} <Link href="/login" style={{ color: 'var(--accent)' }}>{t('register.loginLink')}</Link></p>
        </div>
      </form>
    </div>
  );
}
