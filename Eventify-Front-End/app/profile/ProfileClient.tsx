'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api, City, Ticket } from '../../services/api';

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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');

  useEffect(() => {
    api.getAllCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (user?.preferredCityId) {
      setSelectedCityId(user.preferredCityId);
    }
  }, [user?.preferredCityId]);

  // Load tickets when tab is switched
  useEffect(() => {
    if (activeTab === 'tickets' && user) {
      setTicketsLoading(true);
      api.getTicketsByUser(user.userId)
        .then(setTickets)
        .catch(console.error)
        .finally(() => setTicketsLoading(false));
    }
  }, [activeTab, user?.userId]);

  const handleSavePreference = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await api.setPreferredCity(user.userId, selectedCityId);
      setAuthPreferredCity(selectedCityId);
      setSaveMessage(t('profile.preferencesSaved'));
    } catch {
      setSaveMessage(t('profile.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelTicket = async (ticketId: number) => {
    try {
      await api.cancelTicket(ticketId);
      setTickets(prev => prev.filter(t => t.ticketId !== ticketId));
    } catch (err) {
      console.error('Failed to cancel ticket:', err);
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
      <div className="card" style={{ maxWidth: 560, width: '100%' }}>
        {/* User header */}
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

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t('profile.title')}
          </button>
          <button
            className={`profile-tab ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
            </svg>
            {t('profile.myTickets')}
            {tickets.length > 0 && activeTab === 'tickets' && (
              <span style={{
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: 999,
                padding: '1px 8px',
                fontSize: 11,
                fontWeight: 700,
                marginLeft: 6,
              }}>
                {tickets.length}
              </span>
            )}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
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

            <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
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
                  color: saveMessage === t('profile.saveFailed') ? '#ef4444' : '#22c55e',
                  textAlign: 'center'
                }}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            {ticketsLoading ? (
              <p className="muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                {t('common.loading')}
              </p>
            ) : tickets.length === 0 ? (
              <div className="empty-state" style={{ margin: 0 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12, opacity: 0.5 }}>
                  <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                </svg>
                <p>{t('profile.noTickets')}</p>
                <Link href="/events" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                  {t('common.browseEvents')}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tickets.map(ticket => {
                  const ticketDate = new Date(ticket.event?.eventDate);
                  const isUpcoming = ticketDate >= new Date();
                  return (
                    <div
                      key={ticket.ticketId}
                      className="ticket-card"
                      style={{ opacity: isUpcoming ? 1 : 0.6 }}
                    >
                      <div style={{ display: 'flex', gap: 14, flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          background: isUpcoming ? 'var(--accent-bg)' : 'var(--surface)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 12px',
                          minWidth: 52,
                        }}>
                          <span style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: isUpcoming ? 'var(--accent)' : 'var(--muted)',
                            lineHeight: 1,
                          }}>
                            {ticketDate.getDate()}
                          </span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: isUpcoming ? 'var(--accent)' : 'var(--muted)',
                            textTransform: 'uppercase',
                          }}>
                            {ticketDate.toLocaleDateString('en-GB', { month: 'short' })}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link
                            href={`/events/${ticket.event?.eventId}`}
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: 'var(--text)',
                              textDecoration: 'none',
                            }}
                          >
                            {ticket.event?.title}
                          </Link>
                          <p className="muted small" style={{ margin: '2px 0 0' }}>
                            &euro;{ticket.price?.toFixed(2)}
                            {ticket.seatNumber && ` · ${t('tickets.seat')} ${ticket.seatNumber}`}
                          </p>
                        </div>
                      </div>
                      {isUpcoming && (
                        <button
                          onClick={() => handleCancelTicket(ticket.ticketId)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)', flexShrink: 0 }}
                          title={t('tickets.cancel')}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
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
