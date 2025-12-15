'use client';
import { Venue, Event } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface VenueCardProps {
  venue: Venue;
  events?: Event[];
  maxEvents?: number;
  onViewSchedule?: (venueId: number) => void;
}

/**
 * Reusable VenueCard component
 * Displays venue information with optional events list
 */
export default function VenueCard({ 
  venue, 
  events = [], 
  maxEvents = 5,
  onViewSchedule 
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
    <article className="card venue-card" aria-labelledby={`ven-${venue.venueId}`}>
      <h4 id={`ven-${venue.venueId}`} className="title">{venue.name}</h4>
      <p className="bio">{venue.address || t('venue.noAddress')}</p>
      {venue.capacity && <p className="small muted">{t('venue.capacity')}: {venue.capacity}</p>}
      
      <p className="small"><strong>{t('cities.upcomingEvents')}</strong></p>
      {events.length === 0 ? (
        <div className="small muted">{t('cities.noEventsYet')}</div>
      ) : (
        <ul>
          {displayedEvents.map((e) => (
            <li key={e.eventId}>
              {new Date(e.eventDate).toLocaleDateString()} {e.startTime.substring(0, 5)} — {e.title}
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="small muted">{t('cities.moreEvents', { count: remainingCount })}</li>
          )}
        </ul>
      )}
      
      <div style={{ marginTop: 12 }}>
        {onViewSchedule ? (
          <button 
            onClick={handleViewSchedule} 
            className="btn btn-ghost"
            aria-label={`${t('events.viewSchedule')} ${venue.name}`}
          >
            {t('events.viewSchedule')}
          </button>
        ) : (
          <a 
            href={`/venue/${venue.venueId}`} 
            className="btn btn-ghost" 
            aria-label={`${t('events.viewSchedule')} ${venue.name}`}
          >
            {t('events.viewSchedule')}
          </a>
        )}
      </div>
    </article>
  );
}
