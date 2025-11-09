import { listCities, listVenuesByCity, listEventsByVenue } from '../../services/data';

function VenueCard({ v }: { v: any }) {
  const evts = listEventsByVenue(v.id);
  return (
    <article className="card venue-card" aria-labelledby={"ven-" + v.id}>
      <h4 id={"ven-" + v.id} className="title">{v.name}</h4>
      <p className="bio">{v.bio}</p>
      <p className="small"><strong>Upcoming events:</strong></p>
      {evts.length === 0 ? (
        <div className="small">Nothing to see here yet.</div>
      ) : (
        <ul>
          {evts.map((e: any) => (
            <li key={e.id}>{new Date(e.date).toLocaleString()} — {e.title}</li>
          ))}
        </ul>
      )}
      <div style={{marginTop:12}}>
        <a href={'/venue?id=' + v.id} className="btn btn-ghost" aria-label={`View schedule for ${v.name}`}>View schedule</a>
      </div>
    </article>
  );
}

export default function CitiesPage() {
  const cities = listCities();
  return (
    <div>
      <h2>Cities</h2>
      <p className="muted small">Explore venues grouped by city and see upcoming events at each venue.</p>
      {cities.map((c: any) => (
        <section key={c.id} style={{marginTop:18}}>
          <h3>{c.name}</h3>
          <div className="grid" style={{marginTop:10}}>
            {listVenuesByCity(c.id).map((v: any) => (
              <VenueCard key={v.id} v={v} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
