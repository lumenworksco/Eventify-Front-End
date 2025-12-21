/**
 * Custom hook for API requests with SWR
 * Provides caching, revalidation, and error handling
 */
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { useAuth } from '../context/AuthContext';
import type { Event, Venue, City, Ticket } from '../services/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventify-back-end.onrender.com/api';

interface ApiError {
  message: string;
  status: number;
}

// Fetcher function for SWR
async function fetcher<T>(url: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || `HTTP error! status: ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

/**
 * Custom hook for fetching data with SWR
 * Includes authentication token automatically when user is logged in
 */
export function useApi<T>(
  endpoint: string | null,
  config?: SWRConfiguration
): SWRResponse<T, ApiError> {
  const { user } = useAuth();
  
  const url = endpoint ? `${API_BASE_URL}${endpoint}` : null;
  
  return useSWR<T, ApiError>(
    url,
    (url: string) => fetcher<T>(url, user?.token),
    {
      revalidateOnFocus: false,
      ...config,
    }
  );
}

/**
 * Hook for fetching events
 */
export function useEvents() {
  return useApi<Event[]>('/events');
}

/**
 * Hook for fetching a single event
 */
export function useEvent(eventId: number | null) {
  return useApi<Event>(eventId ? `/events/${eventId}` : null);
}

/**
 * Hook for fetching events by city
 */
export function useEventsByCity(cityId: number | null) {
  return useApi<Event[]>(cityId ? `/events/city/${cityId}` : null);
}

/**
 * Hook for fetching upcoming events
 */
export function useUpcomingEvents() {
  return useApi<Event[]>('/events/upcoming');
}

/**
 * Hook for fetching venues
 */
export function useVenues() {
  return useApi<Venue[]>('/venues');
}

/**
 * Hook for fetching a single venue
 */
export function useVenue(venueId: number | null) {
  return useApi<Venue>(venueId ? `/venues/${venueId}` : null);
}

/**
 * Hook for fetching venues by city
 */
export function useVenuesByCity(cityId: number | null) {
  return useApi<Venue[]>(cityId ? `/venues/city/${cityId}` : null);
}

/**
 * Hook for fetching cities
 */
export function useCities() {
  return useApi<City[]>('/cities');
}

/**
 * Hook for fetching a single city
 */
export function useCity(cityId: number | null) {
  return useApi<City>(cityId ? `/cities/${cityId}` : null);
}

/**
 * Hook for fetching tickets
 */
export function useTickets() {
  return useApi<Ticket[]>('/tickets');
}

/**
 * Hook for fetching tickets by user
 */
export function useTicketsByUser(userId: number | null) {
  return useApi<Ticket[]>(userId ? `/tickets/user/${userId}` : null);
}

/**
 * Hook for fetching available tickets for an event
 */
export function useAvailableTickets(eventId: number | null) {
  return useApi<{ eventId: number; availableTickets: number | string }>(
    eventId ? `/tickets/event/${eventId}/available` : null
  );
}

/**
 * Hook for fetching event types
 */
export function useEventTypes() {
  return useApi<string[]>('/events/types');
}
