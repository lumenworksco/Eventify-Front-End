'use client';
import Link from 'next/link';
import { Event, Venue } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface EventCardProps {
  event: Event;
  onViewSchedule?: (venueId: number) => void;
  showVenueLink?: boolean;
}

export default function EventCard({
  event,
  onViewSchedule,
  showVenueLink = true,
}: EventCardProps) {
  const { t } = useLanguage();
  const primaryVenue = event.venues && event.venues.length > 0 ? event.venues[0] : null;
  const city = primaryVenue?.city;
  const hasTickets = event.availableTickets !== null && event.availableTickets > 0;
  const eventType = event.eventDescription?.eventType;

  function formatTime(time: string): string {
    return time.substring(0, 5);
  }

  return (
    <Link href={`/events/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="event-card-v2">
        <div className="event-card-date">
          <span className="event-card-day">{new Date(event.eventDate).getDate()}</span>
          <span className="event-card-month">{new Date(event.eventDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
        </div>
        <div className="event-card-body">
          <div className="event-card-top">
            {eventType && <span className="event-type-badge">{eventType}</span>}
            {hasTickets && (
              <span className="event-tickets-badge">
                {event.availableTickets} tickets
              </span>
            )}
          </div>
          <h3 className="event-card-title">{event.title}</h3>
          <div className="event-card-meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
            {primaryVenue && (
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {primaryVenue.name}{city ? `, ${city.name}` : ''}
              </span>
            )}
          </div>
          {event.eventDescription?.featuredArtists && (
            <div className="event-card-artists">
              {event.eventDescription.featuredArtists}
            </div>
          )}
        </div>
        <div className="event-card-action">
          <span className="btn btn-ghost btn-sm">{t('common.viewDetails')}</span>
        </div>
      </article>
    </Link>
  );
}
