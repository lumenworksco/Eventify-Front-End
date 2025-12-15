'use client';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
  userId: number;
  name: string;
  role: string;
  location: string | null;
  eventPreference: string | null;
  cityName: string | null;
}

interface ProfileClientProps {
  user?: UserProfile;
  error?: string;
}

export default function ProfileClient({ user, error }: ProfileClientProps) {
  const { t } = useLanguage();
  const { logout } = useAuth();

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh' 
      }}>
        <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
          <h2>{t('profile.title')}</h2>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
          <Link href="/login" className="btn btn-primary">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { bg: '#fef3c7', text: '#92400e' };
      case 'ORGANIZER': return { bg: '#dbeafe', text: '#1e40af' };
      default: return { bg: '#e0e7ff', text: '#3730a3' };
    }
  };

  const roleColors = getRoleBadgeColor(user.role);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '2rem 1rem' 
    }}>
      <div className="card" style={{ maxWidth: 500, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: roleColors.bg,
            color: roleColors.text,
            marginTop: '0.5rem'
          }}>
            {user.role}
          </span>
        </div>

        <div style={{ borderTop: '1px solid #e6edf3', paddingTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="small muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
              {t('profile.location')}
            </label>
            <p style={{ margin: 0 }}>{user.location || t('profile.notSet')}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="small muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
              {t('profile.city')}
            </label>
            <p style={{ margin: 0 }}>{user.cityName || t('profile.notSet')}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="small muted" style={{ display: 'block', marginBottom: '0.25rem' }}>
              {t('profile.eventPreference')}
            </label>
            <p style={{ margin: 0 }}>{user.eventPreference || t('profile.notSet')}</p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center',
          borderTop: '1px solid #e6edf3',
          paddingTop: '1.5rem'
        }}>
          <Link href="/" className="btn btn-ghost">
            {t('nav.home')}
          </Link>
          <button onClick={logout} className="btn btn-primary">
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
