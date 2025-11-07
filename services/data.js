/**
 * Hard-coded data service
 * - cities
 * - venues
 * - events
 *
 * addEvent(event) stores the new event in-memory (only for front-end demonstration)
 */

const cities = [
  { id: 'c1', name: 'Brussels' },
  { id: 'c2', name: 'Antwerp' },
  { id: 'c3', name: 'Ghent' },
  { id: 'c4', name: 'Leuven' },
  { id: 'c5', name: 'Liège' },
];

const venues = [
  { id: 'v1', name: 'Ancienne Belgique', cityId: 'c1', bio: 'Popular concert venue in Brussels' },
  { id: 'v2', name: 'Flagey', cityId: 'c1', bio: 'Cultural house with concerts and events' },
  { id: 'v3', name: 'Trix', cityId: 'c2', bio: 'Underground venue in Antwerp' },
  { id: 'v4', name: 'Vooruit', cityId: 'c3', bio: 'Historic arts centre in Ghent' },
  { id: 'v5', name: 'STUK', cityId: 'c4', bio: 'Cultural venue near the university in Leuven' },
  { id: 'v6', name: 'Le Forum', cityId: 'c5', bio: 'Live music and events space in Liège' },
  { id: 'v7', name: 'Klara', cityId: 'c1', bio: 'Small jazz & experimental venue in Brussels' },
];

const events = [
  { id: 'e1', title: 'Electronic Night', venueId: 'v1', date: '2025-11-15T20:00', description: 'A night of electronic music.', hasTicket: true, type: 'music' },
  { id: 'e2', title: 'Comedy Hour', venueId: 'v2', date: '2025-11-18T19:30', description: 'Stand-up comedy show.', hasTicket: false, type: 'comedy' },
  { id: 'e3', title: 'Indie Fest', venueId: 'v3', date: '2025-11-20T18:00', description: 'Local indie bands.', hasTicket: true, type: 'music' },
  { id: 'e4', title: 'Folk Evening', venueId: 'v4', date: '2025-12-01T19:00', description: 'Acoustic folk acts from the region.', hasTicket: false, type: 'music' },
  { id: 'e5', title: 'Student Film Night', venueId: 'v5', date: '2025-12-05T20:30', description: 'Short films by local students.', hasTicket: false, type: 'film' },
  { id: 'e6', title: 'World Beats', venueId: 'v6', date: '2026-01-10T21:00', description: 'An evening of global rhythms and DJs.', hasTicket: true, type: 'music' },
  { id: 'e7', title: 'Jazz Session', venueId: 'v7', date: '2025-11-30T20:00', description: 'Late-night jazz sets.', hasTicket: true, type: 'music' },
  { id: 'e8', title: 'Poetry Slam', venueId: 'v2', date: '2025-12-12T18:30', description: 'Open mic poetry and spoken word.', hasTicket: false, type: 'spoken' },
  { id: 'e9', title: 'New Year Dance', venueId: 'v1', date: '2025-12-31T22:00', description: 'Celebrate the new year with DJs and friends.', hasTicket: true, type: 'party' },
  { id: 'e10', title: 'Classical Evening', venueId: 'v1', date: '2026-01-20T19:30', description: 'String quartet and chamber music.', hasTicket: true, type: 'classical' },
  { id: 'e11', title: 'Open Mic Night', venueId: 'v4', date: '2025-12-08T20:00', description: 'Comedy, music and spoken word from the local community.', hasTicket: false, type: 'open' },
  { id: 'e12', title: 'Documentary Screening', venueId: 'v5', date: '2026-02-14T19:00', description: 'A special screening with director Q&A.', hasTicket: true, type: 'film' },
  { id: 'e13', title: 'Electronic Workshop', venueId: 'v6', date: '2026-03-05T18:00', description: 'Hands-on electronic music production.', hasTicket: true, type: 'workshop' },
  { id: 'e14', title: 'Indie Showcase', venueId: 'v3', date: '2026-01-15T20:00', description: 'A night featuring rising indie bands.', hasTicket: true, type: 'music' },
  { id: 'e15', title: 'Retro Night', venueId: 'v2', date: '2026-02-28T21:00', description: 'Dance to retro hits and classics.', hasTicket: false, type: 'party' },
  { id: 'e16', title: 'Children Theatre', venueId: 'v5', date: '2025-12-20T14:00', description: 'A family-friendly theatre show for kids.', hasTicket: true, type: 'theatre' },
  { id: 'e17', title: 'Local Market & Music', venueId: 'v4', date: '2025-12-21T10:00', description: 'Weekend market with live background music.', hasTicket: false, type: 'market' },
  { id: 'e18', title: 'Poetry Night', venueId: 'v7', date: '2026-01-08T19:30', description: 'An intimate evening of poetry readings.', hasTicket: false, type: 'spoken' },
];

function listCities() {
  return cities;
}

function listVenuesByCity(cityId) {
  return venues.filter(v => v.cityId === cityId);
}

function getVenue(id) {
  return venues.find(v => v.id === id);
}

function listEventsByVenue(venueId) {
  return events.filter(e => e.venueId === venueId).sort((a,b)=> new Date(a.date)-new Date(b.date));
}

function getEvent(id) {
  return events.find(e => e.id === id);
}

function addEvent(evt) {
  // Basic validation: title required, date must be in future, venueId must exist
  const errors = [];
  if (!evt.title || evt.title.trim().length < 3) errors.push('Title must be at least 3 characters');
  if (!evt.venueId || !venues.find(v=>v.id===evt.venueId)) errors.push('Valid venue must be selected');
  if (!evt.date || isNaN(Date.parse(evt.date))) errors.push('Valid date/time required');
  else if (new Date(evt.date) <= new Date()) errors.push('Date/time must be in the future');
  if (errors.length) return { success:false, errors };
  // create id
  const id = 'e' + (events.length + 1);
  const newEvt = { id, ...evt };
  events.push(newEvt);
  return { success:true, event:newEvt };
}

export { listCities, listVenuesByCity, getVenue, listEventsByVenue, getEvent, addEvent, cities, venues, events };

// For CommonJS interop (in case any legacy code requires default export)
export default { listCities, listVenuesByCity, getVenue, listEventsByVenue, getEvent, addEvent, cities, venues, events };
