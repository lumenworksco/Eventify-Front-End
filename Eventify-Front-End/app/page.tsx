'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, Event, Venue, City } from '../services/api';
import { useEvents } from '../hooks/useApi';
import EventCard from '../components/EventCard';

export default function Page() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [preferredCity, setPreferredCity] = useState<City | null>(null);
  const [cityEvents, setCityEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: allEvents } = useEvents();

  // Get upcoming events (next 6)
  const upcomingEvents = (allEvents || [])
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 6);

  // Get unique event types for stats
  const eventTypes = new Set(
    (allEvents || [])
      .map(e => e.eventDescription?.eventType)
      .filter(Boolean)
  );

  useEffect(() => {
    async function fetchPreferredData() {
      if (!isAuthenticated || !user) {
        setPreferredCity(null);
        setCityEvents([]);
        return;
      }

      if (user.preferredCityId) {
        setLoading(true);
        try {
          const [cityData, eventsData] = await Promise.all([
            api.getCityById(user.preferredCityId),
            api.getEventsByCity(user.preferredCityId),
          ]);
          setPreferredCity(cityData);
          setCityEvents(eventsData.slice(0, 6));
        } catch (err) {
          console.error('Error fetching preferred city data:', err);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const userData = await api.getUserById(user.userId);
          if (userData.preferredCity) {
            setLoading(true);
            const eventsData = await api.getEventsByCity(userData.preferredCity.cityId);
            setPreferredCity(userData.preferredCity);
            setCityEvents(eventsData.slice(0, 6));
            setLoading(false);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    }
    fetchPreferredData();
  }, [isAuthenticated, user?.userId, user?.preferredCityId]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Belgium&apos;s Event Platform</span>
          <h1 className="hero-title">{t('home.title')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          <div className="hero-actions">
            <Link href="/events" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {t('home.browseEvents')}
            </Link>
            <Link href="/cities" className="btn btn-ghost btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t('home.exploreCities')}
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{(allEvents || []).length}</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{eventTypes.size}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">5</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>
      </section>

      {/* Preferred City Section */}
      {isAuthenticated && preferredCity && (
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t('home.eventsIn') || 'Events in'} {preferredCity.name}
              </h2>
              <p className="muted small">Personalized events based on your city preference</p>
            </div>
            <Link href="/profile" className="btn btn-ghost btn-sm">
              {t('home.changeCity') || 'Change city'}
            </Link>
          </div>
          {loading ? (
            <p className="muted">{t('common.loading') || 'Loading...'}</p>
          ) : cityEvents.length > 0 ? (
            <div className="events-list">
              {cityEvents.map(event => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>{t('home.noEventsInCity') || 'No upcoming events in this city'}</p>
            </div>
          )}
        </section>
      )}

      {/* Personalize prompt */}
      {isAuthenticated && !preferredCity && !loading && (
        <section className="section">
          <div className="personalize-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h3>{t('home.personalizeTitle') || 'Personalize Your Experience'}</h3>
            <p className="muted">
              {t('home.personalizeDesc') || 'Set a preferred city to see events and venues tailored to you'}
            </p>
            <Link href="/profile" className="btn btn-primary">
              {t('home.setPreference') || 'Set Preferred City'}
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Upcoming Events
              </h2>
              <p className="muted small">Don&apos;t miss what&apos;s happening next</p>
            </div>
            <Link href="/events" className="btn btn-ghost btn-sm">View all events</Link>
          </div>
          <div className="events-list">
            {upcomingEvents.map(event => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section">
        <h2 className="section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>{t('home.whatYouCanDo')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3>{t('home.browseTitle')}</h3>
            <p>{t('home.browseDesc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3>{t('home.discoverTitle')}</h3>
            <p>{t('home.discoverDesc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3>{t('home.addTitle')}</h3>
            <p>{t('home.addDesc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
