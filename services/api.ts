/**
 * API Service for connecting to Spring Boot backend
 * Provides typed interfaces and fetch functions for all entities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ============================
// Type Definitions
// ============================

export interface City {
  cityId: number;
  name: string;
  region: string | null;
  country: string;
}

export interface Venue {
  venueId: number;
  name: string;
  address: string | null;
  capacity: number | null;
  city: City;
}

export interface EventDescription {
  descriptionId: number;
  eventType: string | null;
  featuredArtists: string | null;
  ticketPurchaseLink: string | null;
  extraDescription: string | null;
}

export interface Event {
  eventId: number;
  title: string;
  eventDate: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  availableTickets: number | null;
  eventDescription: EventDescription | null;
  venues?: Venue[];
}

export interface User {
  userId: number;
  name: string;
  role: 'USER' | 'ADMIN';
  location: string | null;
  eventPreference: string | null;
  city: City;
}

export interface Ticket {
  ticketId: number;
  user: User;
  event: Event;
  purchaseDate: string;
  price: number;
  seatNumber: string | null;
}

// ============================
// DTO Types (for creating/updating)
// ============================

export interface CreateEventDTO {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  availableTickets?: number | null;
  venueIds: number[];
}

export interface CreateVenueDTO {
  name: string;
  address?: string;
  capacity?: number;
  cityId: number;
}

export interface CreateCityDTO {
  name: string;
  region?: string;
  country: string;
}

export interface CreateTicketDTO {
  userId: number;
  eventId: number;
  price: number;
  seatNumber?: string;
}

export interface RegisterDTO {
  name: string;
  password: string;
  cityId?: number;
  location?: string;
  eventPreference?: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  role: string;
}

// ============================
// API Response wrapper
// ============================

export interface ApiError {
  message: string;
  status: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      // Handle empty responses
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error or server is not available',
        status: 0,
      } as ApiError;
    }
  }

  // ============================
  // City Endpoints
  // ============================

  async getAllCities(): Promise<City[]> {
    return this.request<City[]>('/cities');
  }

  async getCityById(id: number): Promise<City> {
    return this.request<City>(`/cities/${id}`);
  }

  async getCityByName(name: string): Promise<City> {
    return this.request<City>(`/cities/name/${encodeURIComponent(name)}`);
  }

  async createCity(city: CreateCityDTO): Promise<City> {
    return this.request<City>('/cities', {
      method: 'POST',
      body: JSON.stringify(city),
    });
  }

  async updateCity(id: number, city: CreateCityDTO): Promise<City> {
    return this.request<City>(`/cities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(city),
    });
  }

  async deleteCity(id: number): Promise<void> {
    return this.request<void>(`/cities/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================
  // Venue Endpoints
  // ============================

  async getAllVenues(): Promise<Venue[]> {
    return this.request<Venue[]>('/venues');
  }

  async getVenueById(id: number): Promise<Venue> {
    return this.request<Venue>(`/venues/${id}`);
  }

  async getVenuesByCity(cityId: number): Promise<Venue[]> {
    return this.request<Venue[]>(`/venues/city/${cityId}`);
  }

  async createVenue(venue: CreateVenueDTO): Promise<Venue> {
    return this.request<Venue>('/venues', {
      method: 'POST',
      body: JSON.stringify(venue),
    });
  }

  async updateVenue(id: number, venue: CreateVenueDTO): Promise<Venue> {
    return this.request<Venue>(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(venue),
    });
  }

  async deleteVenue(id: number): Promise<void> {
    return this.request<void>(`/venues/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================
  // Event Endpoints
  // ============================

  async getAllEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events');
  }

  async getEventById(id: number): Promise<Event> {
    return this.request<Event>(`/events/${id}`);
  }

  async getEventsByCity(cityId: number): Promise<Event[]> {
    return this.request<Event[]>(`/events/city/${cityId}`);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events/upcoming');
  }

  async getEventsByDate(date: string): Promise<Event[]> {
    return this.request<Event[]>(`/events/date/${date}`);
  }

  async getEventsBetweenDates(startDate: string, endDate: string): Promise<Event[]> {
    return this.request<Event[]>(`/events/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  async createEvent(event: CreateEventDTO): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(id: number, event: CreateEventDTO): Promise<Event> {
    return this.request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(id: number): Promise<void> {
    return this.request<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async addVenueToEvent(eventId: number, venueId: number): Promise<Event> {
    return this.request<Event>(`/events/${eventId}/venues/${venueId}`, {
      method: 'POST',
    });
  }

  async removeVenueFromEvent(eventId: number, venueId: number): Promise<Event> {
    return this.request<Event>(`/events/${eventId}/venues/${venueId}`, {
      method: 'DELETE',
    });
  }

  // ============================
  // Ticket Endpoints
  // ============================

  async getAllTickets(): Promise<Ticket[]> {
    return this.request<Ticket[]>('/tickets');
  }

  async getTicketById(id: number): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${id}`);
  }

  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/tickets/user/${userId}`);
  }

  async getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    return this.request<Ticket[]>(`/tickets/event/${eventId}`);
  }

  async getAvailableTickets(eventId: number): Promise<{ eventId: number; availableTickets: number | string }> {
    return this.request(`/tickets/event/${eventId}/available`);
  }

  async purchaseTicket(ticket: CreateTicketDTO): Promise<Ticket> {
    return this.request<Ticket>('/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  async cancelTicket(id: number): Promise<{ message: string }> {
    return this.request(`/tickets/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================
  // User/Auth Endpoints
  // ============================

  async register(data: RegisterDTO): Promise<LoginResponse> {
    return this.request<LoginResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL);

// Also export for backward compatibility with in-memory data structure
// This allows gradual migration
export function convertToLegacyFormat(events: Event[], venues: Venue[], cities: City[]) {
  const legacyCities = cities.map(c => ({
    id: `c${c.cityId}`,
    name: c.name,
  }));

  const legacyVenues = venues.map(v => ({
    id: `v${v.venueId}`,
    name: v.name,
    cityId: `c${v.city.cityId}`,
    bio: v.address || '',
  }));

  const legacyEvents = events.map(e => ({
    id: `e${e.eventId}`,
    title: e.title,
    venueId: e.venues && e.venues.length > 0 ? `v${e.venues[0].venueId}` : '',
    date: `${e.eventDate}T${e.startTime.substring(0, 5)}`,
    description: e.eventDescription?.extraDescription || '',
    hasTicket: e.availableTickets !== null && e.availableTickets > 0,
    type: e.eventDescription?.eventType || 'general',
  }));

  return { cities: legacyCities, venues: legacyVenues, events: legacyEvents };
}
