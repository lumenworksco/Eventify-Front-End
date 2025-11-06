"use client";
import { useState } from 'react';
import { events, venues, cities } from '../../services/data';

function getVenue(vId: string) {
  return venues.find((v: any) => v.id === vId);
}

export default function EventsPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const types = Array.from(new Set(events.map((e: any) => e.type).filter(Boolean)));

  const filtered = events
    .filter((e: any) => (typeFilter ? e.type === typeFilter : true))
    .filter((e: any) => {
      if (!cityFilter) return true;
      const v = getVenue(e.venueId);
      return v?.cityId === cityFilter;
    })
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h2>Events Overview</h2>
      <p className="muted">Browse all upcoming events across venues. Use the filters to narrow results.</p>

      <div className="card">
        <div className="controls">
          <div>
            <label className="small">Filter by city</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="">All cities</option>
              {cities.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="small">Filter by type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All types</option>
              {types.map((t: any) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">No events found matching the filters.</div>
      ) : (
        <div className="grid" style={{marginTop:12}}>
          {filtered.map((e: any) => {
            const v = getVenue(e.venueId);
            const city = cities.find((c: any) => c.id === v?.cityId);
            return (
              <article key={e.id} className="card">
                <div className="event-row">
                  <div className="event-date">{new Date(e.date).toLocaleString()}</div>
                  <div className="event-info">
                    <div className="event-title">{e.title}</div>
                    <div className="event-meta">{v?.name}{city ? ` — ${city.name}` : ''}{e.hasTicket ? ' • Ticketed' : ''}</div>
                  </div>
                  <div className="event-actions">
                    <a href={'/city?id=' + (v?.id || '')} className="btn btn-ghost">View schedule</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
