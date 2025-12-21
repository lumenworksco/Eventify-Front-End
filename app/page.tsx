'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, Event, Venue, City } from '../services/api';
import EventCard from '../components/EventCard';
import VenueCard from '../components/VenueCard';

export default function Page() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [preferredCity, setPreferredCity] = useState<City | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]); // All events for venue filtering
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's preferred city data when authenticated
  useEffect(() => {
    async function fetchPreferredData() {
      if (!isAuthenticated || !user) {
        setPreferredCity(null);
        setEvents([]);
        setAllEvents([]);
        setVenues([]);
        return;
      }

      // Check if user has a preferred city in context
      if (user.preferredCityId) {
        setLoading(true);
        try {
          const [cityData, eventsData, venuesData] = await Promise.all([
            api.getCityById(user.preferredCityId),
            api.getEventsByCity(user.preferredCityId),
            api.getVenuesByCity(user.preferredCityId)
          ]);
          setPreferredCity(cityData);
          setAllEvents(eventsData); // Store all events for venue filtering
          setEvents(eventsData.slice(0, 6)); // Show max 6 events in event section
          setVenues(venuesData.slice(0, 4)); // Show max 4 venues
        } catch (err) {
          console.error('Error fetching preferred city data:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Try to fetch user data to get preferred city
        try {
          const userData = await api.getUserById(user.userId);
          if (userData.preferredCity) {
            setLoading(true);
            const [eventsData, venuesData] = await Promise.all([
              api.getEventsByCity(userData.preferredCity.cityId),
              api.getVenuesByCity(userData.preferredCity.cityId)
            ]);
            setPreferredCity(userData.preferredCity);
            setAllEvents(eventsData); // Store all events for venue filtering
            setEvents(eventsData.slice(0, 6));
            setVenues(venuesData.slice(0, 4));
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
      <section className="hero card">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <h2 style={{margin:0,fontSize:28}}>{t('home.title')}</h2>
          <p className="muted" style={{margin:0}}>{t('home.subtitle')}</p>
          <div style={{marginTop:14,display:'flex',gap:12}}>
            <Link href="/events" className="btn btn-primary">{t('home.browseEvents')}</Link>
            <Link href="/cities" className="btn btn-ghost">{t('home.exploreCities')}</Link>
          </div>
        </div>
      </section>

      {/* Preferred City Section - Only show when authenticated and has preference */}
      {isAuthenticated && preferredCity && (
        <section style={{marginTop:24}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>
              {t('home.eventsIn') || 'Events in'} {preferredCity.name}
            </h3>
            <Link href="/profile" className="small" style={{ color: 'var(--accent)' }}>
              {t('home.changeCity') || 'Change city'}
            </Link>
          </div>
          
          {loading ? (
            <p className="muted">{t('common.loading') || 'Loading...'}</p>
          ) : (
            <>
              {events.length > 0 ? (
                <div className="grid" style={{marginTop:10}}>
                  {events.map(event => (
                    <EventCard key={event.eventId} event={event} />
                  ))}
                </div>
              ) : (
                <p className="muted">{t('home.noEventsInCity') || 'No upcoming events in this city'}</p>
              )}

              {venues.length > 0 && (
                <>
                  <h4 style={{ marginTop: 24, marginBottom: 10 }}>
                    {t('home.venuesIn') || 'Venues in'} {preferredCity.name}
                  </h4>
                  <div className="grid" style={{marginTop:10}}>
                    {venues.map(venue => (
                      <VenueCard 
                        key={venue.venueId} 
                        venue={venue} 
                        events={allEvents.filter(event => 
                          event.venues?.some(v => v.venueId === venue.venueId)
                        )}
                        maxEvents={3}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      )}

      {/* Show prompt to set preference if authenticated but no preference */}
      {isAuthenticated && !preferredCity && !loading && (
        <section style={{marginTop:24}}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>
              {t('home.personalizeTitle') || 'Personalize Your Experience'}
            </h3>
            <p className="muted" style={{ margin: '0 0 1rem 0' }}>
              {t('home.personalizeDesc') || 'Set a preferred city to see events and venues tailored to you'}
            </p>
            <Link href="/profile" className="btn btn-primary">
              {t('home.setPreference') || 'Set Preferred City'}
            </Link>
          </div>
        </section>
      )}

      <section style={{marginTop:24}}>
        <h3>{t('home.whatYouCanDo')}</h3>
        <div className="grid grid--tight" style={{marginTop:10}}>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{t('home.browseTitle')}</div>
                <div className="card-sub">{t('home.browseDesc')}</div>
              </div>
              <div className="badge">{t('home.badgeFree')}</div>
            </div>
          </article>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{t('home.discoverTitle')}</div>
                <div className="card-sub">{t('home.discoverDesc')}</div>
              </div>
              <div className="badge">{t('home.badgeLocal')}</div>
            </div>
          </article>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{t('home.addTitle')}</div>
                <div className="card-sub">{t('home.addDesc')}</div>
              </div>
              <div className="badge">{t('home.badgeQuick')}</div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
