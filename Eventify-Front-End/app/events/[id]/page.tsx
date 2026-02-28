'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '../../../hooks/useApi';
import { useLanguage } from '../../../context/LanguageContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id ? parseInt(params.id as string) : null;
  const { t } = useLanguage();

  const { data: event, error, isLoading, mutate } = useEvent(eventId);

  if (!eventId) {
    return (
      <div className="empty-state">
        <p>{t('eventDetail.notFound')}</p>
        <Link href="/events" className="btn btn-primary" style={{ marginTop: 16 }}>{t('common.browseEvents')}</Link>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={() => mutate()} />;
  }

  if (!event) {
    return (
      <div className="empty-state">
        <p>{t('eventDetail.notFound')}</p>
        <Link href="/events" className="btn btn-primary" style={{ marginTop: 16 }}>{t('common.browseEvents')}</Link>
      </div>
    );
  }

  const primaryVenue = event.venues && event.venues.length > 0 ? event.venues[0] : null;
  const eventType = event.eventDescription?.eventType;
  const hasTickets = event.availableTickets !== null && event.availableTickets > 0;
  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();

  function formatTime(time: string): string {
    return time.substring(0, 5);
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/events"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--muted)',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 20,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t('common.backToEvents')}
      </Link>

      {/* Main event card */}
      <div className="event-detail">
        {/* Header */}
        <div className="event-detail-header">
          <div className="event-detail-date-block">
            <span className="event-detail-day">{eventDate.getDate()}</span>
            <span className="event-detail-month">
              {eventDate.toLocaleDateString('en-GB', { month: 'short' })}
            </span>
            <span className="event-detail-year">{eventDate.getFullYear()}</span>
          </div>
          <div className="event-detail-header-info">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              {eventType && <span className="event-type-badge">{eventType}</span>}
              {isPast && (
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(100, 116, 139, 0.1)',
                  color: '#64748b',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                }}>{t('eventDetail.pastEvent')}</span>
              )}
              {hasTickets && !isPast && (
                <span className="event-tickets-badge">
                  {t('eventDetail.available', { count: event.availableTickets || 0 })}
                </span>
              )}
            </div>
            <h1 className="event-detail-title">{event.title}</h1>
          </div>
        </div>

        {/* Info grid */}
        <div className="event-detail-grid">
          {/* Time */}
          <div className="event-detail-info-card">
            <div className="event-detail-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="event-detail-info-label">{t('eventDetail.time')}</p>
              <p className="event-detail-info-value">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
              <p className="event-detail-info-sub">
                {eventDate.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Venue */}
          {primaryVenue && (
            <div className="event-detail-info-card">
              <div className="event-detail-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="event-detail-info-label">{t('eventDetail.venue')}</p>
                <p className="event-detail-info-value">{primaryVenue.name}</p>
                <p className="event-detail-info-sub">
                  {primaryVenue.address && <>{primaryVenue.address}<br /></>}
                  {primaryVenue.city?.name}
                  {primaryVenue.city?.region && `, ${primaryVenue.city.region}`}
                  {primaryVenue.capacity && <><br />{t('venue.capacity')}: {primaryVenue.capacity.toLocaleString()}</>}
                </p>
              </div>
            </div>
          )}

          {/* Artists */}
          {event.eventDescription?.featuredArtists && (
            <div className="event-detail-info-card">
              <div className="event-detail-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div>
                <p className="event-detail-info-label">{t('eventDetail.featuredArtists')}</p>
                <p className="event-detail-info-value">{event.eventDescription.featuredArtists}</p>
              </div>
            </div>
          )}

          {/* Tickets */}
          {hasTickets && event.eventDescription?.ticketPurchaseLink && !isPast && (
            <div className="event-detail-info-card">
              <div className="event-detail-info-icon" style={{ color: 'var(--success)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                </svg>
              </div>
              <div>
                <p className="event-detail-info-label">{t('eventDetail.tickets')}</p>
                <p className="event-detail-info-value">
                  {t('eventDetail.available', { count: event.availableTickets?.toLocaleString() || 0 })}
                </p>
                <a
                  href={event.eventDescription.ticketPurchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 8 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  {t('eventDetail.getTickets')}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {event.eventDescription?.extraDescription && (
          <div className="event-detail-description">
            <h3>{t('eventDetail.about')}</h3>
            <p>{event.eventDescription.extraDescription}</p>
          </div>
        )}

        {/* All venues */}
        {event.venues && event.venues.length > 1 && (
          <div className="event-detail-description">
            <h3>{t('eventDetail.allVenues')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {event.venues.map(v => (
                <Link
                  key={v.venueId}
                  href={`/venue/${v.venueId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'var(--text)',
                    fontSize: 14,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <div>
                    <strong>{v.name}</strong>
                    {v.city && <span className="muted" style={{ marginLeft: 8 }}>{v.city.name}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
