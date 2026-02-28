'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api, City } from '../../services/api';

interface UserProfile {
  userId: number;
  name: string;
  role: string;
  location: string | null;
  eventPreference: string | null;
  cityName: string | null;
  preferredCityId: number | null;
  preferredCityName: string | null;
}

interface ProfileClientProps {
  user?: UserProfile;
  error?: string;
}

export default function ProfileClient({ user, error }: ProfileClientProps) {
  const { t } = useLanguage();
  const { logout, setPreferredCity: setAuthPreferredCity } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(user?.preferredCityId || null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getAllCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (user?.preferredCityId) {
      setSelectedCityId(user.preferredCityId);
    }
  }, [user?.preferredCityId]);

  const handleSavePreference = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await api.setPreferredCity(user.userId, selectedCityId);
      setAuthPreferredCity(selectedCityId);
      setSaveMessage(t('profile.preferencesSaved'));
    } catch (err) {
      setSaveMessage(t('profile.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

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

          <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #e6edf3', paddingTop: '1rem' }}>
            <label className="small muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
              {t('profile.preferredCity')}
            </label>
            <select
              value={selectedCityId || ''}
              onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                marginBottom: '0.5rem'
              }}
            >
              <option value="">{t('profile.noPreference')}</option>
              {cities.map(city => (
                <option key={city.cityId} value={city.cityId}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
            <button 
              onClick={handleSavePreference}
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {saving ? t('profile.saving') : t('profile.savePreference')}
            </button>
            {saveMessage && (
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                fontSize: '0.875rem', 
                color: saveMessage.includes('Failed') ? '#ef4444' : '#22c55e',
                textAlign: 'center'
              }}>
                {saveMessage}
              </p>
            )}
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
