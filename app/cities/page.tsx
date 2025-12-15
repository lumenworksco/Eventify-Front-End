'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCities, useVenues, useEvents } from '../../hooks/useApi';
import { useLanguage } from '../../context/LanguageContext';
import { City, Venue, Event } from '../../services/api';
import VenueCard from '../../components/VenueCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

interface CityWithVenues extends City {
  venues: VenueWithEvents[];
}

interface VenueWithEvents extends Venue {
  events: Event[];
}

export default function CitiesPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Use SWR hooks for data fetching
  const { data: cities, error: citiesError, isLoading: citiesLoading, mutate: mutateCities } = useCities();
  const { data: venues, error: venuesError, isLoading: venuesLoading } = useVenues();
  const { data: events, error: eventsError, isLoading: eventsLoading } = useEvents();

  const isLoading = citiesLoading || venuesLoading || eventsLoading;
  const error = citiesError || venuesError || eventsError;

  // Process and combine data - memoized for performance
  const citiesWithVenues = useMemo<CityWithVenues[]>(() => {
    if (!cities || !venues || !events) return [];

    // Group venues by city and attach events to venues
    const citiesMap = new Map<number, CityWithVenues>();
    
    // Initialize cities
    cities.forEach(city => {
      citiesMap.set(city.cityId, { ...city, venues: [] });
    });

    // Create a map of venue ID to events
    const venueEventsMap = new Map<number, Event[]>();
    events.forEach(event => {
      if (event.venues) {
        event.venues.forEach((venue: Venue) => {
          const existing = venueEventsMap.get(venue.venueId) || [];
          existing.push(event);
          venueEventsMap.set(venue.venueId, existing);
        });
      }
    });

    // Attach venues to cities with their events
    venues.forEach(venue => {
      const city = citiesMap.get(venue.city.cityId);
      if (city) {
        const venueEvents = venueEventsMap.get(venue.venueId) || [];
        // Sort events by date
        venueEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        city.venues.push({ ...venue, events: venueEvents });
      }
    });

    return Array.from(citiesMap.values());
  }, [cities, venues, events]);

  // Callback for navigating to venue
  function handleViewSchedule(venueId: number) {
    router.push(`/venue/${venueId}`);
  }

  if (isLoading) {
    return (
      <div>
        <h2>{t('cities.title')}</h2>
        <LoadingSpinner message={t('common.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>{t('cities.title')}</h2>
        <ErrorMessage 
          message={error.message} 
          onRetry={() => mutateCities()}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>{t('cities.title')}</h2>
      <p className="muted small">{t('cities.subtitle')}</p>
      
      {citiesWithVenues.length === 0 ? (
        <div className="card">{t('cities.noCities')}</div>
      ) : (
        citiesWithVenues.map((city) => (
          <section key={city.cityId} style={{ marginTop: 18 }}>
            <h3>{city.name}</h3>
            {city.region && <p className="small muted">{city.region}, {city.country}</p>}
            {city.venues.length === 0 ? (
              <div className="card small muted">{t('cities.noVenues')}</div>
            ) : (
              <div className="grid" style={{ marginTop: 10 }}>
                {city.venues.map((venue) => (
                  <VenueCard 
                    key={venue.venueId} 
                    venue={venue} 
                    events={venue.events}
                    onViewSchedule={handleViewSchedule}
                  />
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
