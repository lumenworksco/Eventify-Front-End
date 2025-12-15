'use client';
import { useParams } from 'next/navigation';
import { useVenue, useEvents } from '../../../hooks/useApi';
import { useLanguage } from '../../../context/LanguageContext';
import { Venue } from '../../../services/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';

export default function VenuePage() {
  const params = useParams();
  const venueId = params?.id ? parseInt(params.id as string) : null;
  const { t } = useLanguage();

  const { data: venue, error: venueError, isLoading: venueLoading, mutate: mutateVenue } = useVenue(venueId);
  const { data: events, error: eventsError, isLoading: eventsLoading } = useEvents();

  if (!venueId) {
    return (
      <div className="card">
        {t('venue.idMissing')}
        <a href="/cities" className="btn btn-ghost" style={{ marginLeft: 8 }}>
          {t('venue.browseCities')}
        </a>
      </div>
    );
  }

  const isLoading = venueLoading || eventsLoading;
  const error = venueError || eventsError;

  if (isLoading) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error.message} 
        onRetry={() => mutateVenue()}
      />
    );
  }

  if (!venue) {
    return <div className="card">{t('venue.notFound')}</div>;
  }

  // Filter events for this venue
  const venueEvents = (events || [])
    .filter(event => event.venues?.some((v: Venue) => v.venueId === venueId))
    .sort((a, b) => {
      const dateCompare = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });

  function formatDateTime(date: string, startTime: string): string {
    const eventDate = new Date(date);
    const timeStr = startTime.substring(0, 5);
    return `${eventDate.toLocaleDateString()} ${timeStr}`;
  }

  return (
    <div>
      <div className="card">
        <h2>{venue.name}</h2>
        <p className="muted">{venue.address || t('venue.noAddress')}</p>
        <div className="small muted">
          <strong>{t('venue.city')}:</strong> {venue.city.name}
          {venue.city.region && `, ${venue.city.region}`}, {venue.city.country}
        </div>
        {venue.capacity && (
          <div className="small muted">
            <strong>{t('venue.capacity')}:</strong> {venue.capacity}
          </div>
        )}
      </div>

      <h3 style={{ marginTop: 12 }}>{t('venue.schedule')}</h3>
      {venueEvents.length === 0 ? (
        <div className="card small">{t('venue.noEvents')}</div>
      ) : (
        <div className="card">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {venueEvents.map((event) => (
              <li key={event.eventId} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div className="event-row">
                  <div className="event-date">{formatDateTime(event.eventDate, event.startTime)}</div>
                  <div className="event-info">
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      {event.eventDescription?.eventType}
                      {event.availableTickets !== null && event.availableTickets > 0 && 
                        ` • ${t('events.ticketsAvailable', { count: event.availableTickets })}`}
                    </div>
                    {event.eventDescription?.featuredArtists && (
                      <div className="small muted">
                        {t('venue.featuring', { artists: event.eventDescription.featuredArtists })}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <a href="/events" className="btn btn-ghost">{t('venue.backToEvents')}</a>
        <a href="/cities" className="btn btn-ghost" style={{ marginLeft: 8 }}>{t('venue.backToCities')}</a>
      </div>
    </div>
  );
}
