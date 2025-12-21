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
  const router = useRouter();
  const { t } = useLanguage();

  // Use SWR hooks for data fetching
  const { data: events, error: eventsError, isLoading: eventsLoading, mutate: mutateEvents } = useEvents();
  const { data: cities, error: citiesError, isLoading: citiesLoading } = useCities();
  const { data: eventTypes, error: typesError } = useEventTypes();

  const isLoading = eventsLoading || citiesLoading;
  const error = eventsError || citiesError;

  // Use eventTypes from API, fallback to extracting from events
  const types = eventTypes || (events ? Array.from(
    new Set(
      events
        .map((e) => e.eventDescription?.eventType)
        .filter((t): t is string => Boolean(t))
    )
  ) : []);

  // Filter events
  const filtered = (events || [])
    .filter((e) => {
      if (!typeFilter) return true;
      return e.eventDescription?.eventType === typeFilter;
    })
    .filter((e) => {
      if (!cityFilter) return true;
      return e.venues?.some((v: Venue) => v?.city?.cityId === parseInt(cityFilter));
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  // Callback for navigating to venue
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
      <h2>{t('events.title')}</h2>
      <p className="muted">{t('events.subtitle')}</p>

      <div className="card">
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

      {filtered.length === 0 ? (
        <div className="card">{t('events.noEvents')}</div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
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
