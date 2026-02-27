'use client';
import { Venue, Event } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface VenueCardProps {
  venue: Venue;
  events?: Event[];
  maxEvents?: number;
  onViewSchedule?: (venueId: number) => void;
}

export default function VenueCard({
  venue,
  events = [],
  maxEvents = 5,
  onViewSchedule,
}: VenueCardProps) {
  const { t } = useLanguage();
  const displayedEvents = events.slice(0, maxEvents);
  const remainingCount = events.length - maxEvents;

  function handleViewSchedule() {
    if (onViewSchedule) {
      onViewSchedule(venue.venueId);
    }
  }

  return (
    <article className="venue-card-v2">
      <div className="venue-card-header">
        <div className="venue-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div>
          <h4 className="venue-card-name">{venue.name}</h4>
          <p className="venue-card-address">{venue.address || t('venue.noAddress')}</p>
        </div>
      </div>

      {venue.capacity && (
        <div className="venue-card-capacity">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Capacity: {venue.capacity.toLocaleString()}
        </div>
      )}

      <div className="venue-card-events">
        <p className="venue-events-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {t('cities.upcomingEvents')}
        </p>
        {events.length === 0 ? (
          <p className="venue-no-events">{t('cities.noEventsYet')}</p>
        ) : (
          <ul className="venue-events-list">
            {displayedEvents.map((e) => (
              <li key={e.eventId}>
                <span className="venue-event-date">
                  {new Date(e.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <span className="venue-event-title">{e.title}</span>
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="venue-more-events">
                +{remainingCount} more {remainingCount === 1 ? 'event' : 'events'}
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="venue-card-footer">
        {onViewSchedule ? (
          <button
            onClick={handleViewSchedule}
            className="btn btn-ghost btn-sm btn-full"
          >
            {t('events.viewSchedule')}
          </button>
        ) : (
          <a
            href={`/venue/${venue.venueId}`}
            className="btn btn-ghost btn-sm btn-full"
          >
            {t('events.viewSchedule')}
          </a>
        )}
      </div>
    </article>
  );
}
