'use client';
import { Event, Venue } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface EventCardProps {
  event: Event;
  onViewSchedule?: (venueId: number) => void;
  showVenueLink?: boolean;
}

/**
 * Reusable EventCard component
 * Displays event information in a card format
 */
export default function EventCard({ 
  event, 
  onViewSchedule,
  showVenueLink = true 
}: EventCardProps) {
  const { t } = useLanguage();
  const primaryVenue = event.venues && event.venues.length > 0 ? event.venues[0] : null;
  const city = primaryVenue?.city;
  const hasTickets = event.availableTickets !== null && event.availableTickets > 0;

  function formatDateTime(date: string, startTime: string): string {
    const eventDate = new Date(date);
    const timeStr = startTime.substring(0, 5);
    return `${eventDate.toLocaleDateString()} ${timeStr}`;
  }

  function handleViewSchedule() {
    if (primaryVenue && onViewSchedule) {
      onViewSchedule(primaryVenue.venueId);
    }
  }

  return (
    <article className="card">
      <div className="event-row">
        <div className="event-date">{formatDateTime(event.eventDate, event.startTime)}</div>
        <div className="event-info">
          <div className="event-title">{event.title}</div>
          <div className="event-meta">
            {primaryVenue?.name}
            {city ? ` — ${city.name}` : ''}
            {hasTickets ? ` • ${t('events.ticketsAvailable', { count: event.availableTickets! })}` : ''}
          </div>
          {event.eventDescription?.eventType && (
            <div className="small muted">{t('events.type')}: {event.eventDescription.eventType}</div>
          )}
        </div>
        <div className="event-actions">
          {showVenueLink && primaryVenue && (
            onViewSchedule ? (
              <button 
                onClick={handleViewSchedule} 
                className="btn btn-ghost"
              >
                {t('events.viewSchedule')}
              </button>
            ) : (
              <a 
                href={`/venue/${primaryVenue.venueId}`} 
                className="btn btn-ghost"
              >
                {t('events.viewSchedule')}
              </a>
            )
          )}
        </div>
      </div>
    </article>
  );
}
