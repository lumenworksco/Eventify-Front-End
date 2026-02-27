"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents, useCities, useEventTypes } from '../../hooks/useApi';
import { useLanguage } from '../../context/LanguageContext';
import { Venue } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function EventsPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const { data: events, error: eventsError, isLoading: eventsLoading, mutate: mutateEvents } = useEvents();
  const { data: cities, error: citiesError, isLoading: citiesLoading } = useCities();
  const { data: eventTypes } = useEventTypes();

  const isLoading = eventsLoading || citiesLoading;
  const error = eventsError || citiesError;

  const types = eventTypes || (events ? Array.from(
    new Set(
      events
        .map((e) => e.eventDescription?.eventType)
        .filter((t): t is string => Boolean(t))
    )
  ) : []);

  const filtered = (events || [])
    .filter((e) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.eventDescription?.featuredArtists?.toLowerCase().includes(q) ||
        e.eventDescription?.eventType?.toLowerCase().includes(q) ||
        e.venues?.some((v: Venue) => v.name.toLowerCase().includes(q))
      );
    })
    .filter((e) => {
      if (!typeFilter) return true;
      return e.eventDescription?.eventType === typeFilter;
    })
    .filter((e) => {
      if (!cityFilter) return true;
      return e.venues?.some((v: Venue) => v?.city?.cityId === parseInt(cityFilter));
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  function handleViewSchedule(venueId: number) {
    router.push(`/venue/${venueId}`);
  }

  if (isLoading) {
    return (
      <div>
        <h2>{t('events.title')}</h2>
        <LoadingSpinner message={t('events.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>{t('events.title')}</h2>
        <ErrorMessage
          message={error.message}
          onRetry={() => mutateEvents()}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>{t('events.title')}</h2>
        <p className="muted">{t('events.subtitle')}</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>
        <div className="controls">
          <div>
            <label className="small">{t('events.filterCity')}</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="">{t('events.allCities')}</option>
              {(cities || []).map((c) => (
                <option key={c.cityId} value={c.cityId}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="small">{t('events.filterType')}</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">{t('events.allTypes')}</option>
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="small muted">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'} found
          {(searchQuery || typeFilter || cityFilter) && (
            <button
              onClick={() => { setSearchQuery(''); setTypeFilter(''); setCityFilter(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                marginLeft: 8,
              }}
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No events match your search</p>
          <p className="small muted" style={{ marginTop: 8 }}>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="events-list">
          {filtered.map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              onViewSchedule={handleViewSchedule}
            />
          ))}
        </div>
      )}
    </div>
  );
}
