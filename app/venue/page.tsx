import { getVenue, listEventsByVenue } from '../../services/data';

function VenueSchedule({ venueId }: { venueId: string }) {
  const v = getVenue(venueId);
  if (!v) return <div className="card">Venue not found</div>;
  const evts = listEventsByVenue(venueId);
  return (
    <div>
      <div className="card">
        <h2>{v.name}</h2>
        <p className="muted">{v.bio}</p>
      </div>

      <h3 style={{marginTop:12}}>Schedule</h3>
      {evts.length === 0 ? (
        <div className="card small">Nothing to see here yet.</div>
      ) : (
        <div className="card">
          <ul style={{margin:0,padding:0,listStyle:'none'}}>
            {evts.map((e: any) => (
              <li key={e.id} style={{padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}>
                <div className="event-row">
                  <div className="event-date">{new Date(e.date).toLocaleString()}</div>
                  <div className="event-info">
                    <div className="event-title">{e.title}</div>
                    <div className="event-meta">{e.type}{e.hasTicket? ' • Ticketed':''}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function VenuePage(props: any) {
  const searchParams = props?.searchParams as { id?: string } | undefined;
  const id = searchParams?.id || '';
  if (!id) return <div className="card">Venue id missing</div>;
  return <VenueSchedule venueId={id} />;
}
