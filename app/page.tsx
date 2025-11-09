import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <section className="hero card">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <h2 style={{margin:0,fontSize:28}}>Discover live events near you</h2>
          <p className="muted" style={{margin:0}}>Find concerts, comedy, film and community events at venues across Belgian cities. Filter, explore and add your own events.</p>
          <div style={{marginTop:14,display:'flex',gap:12}}>
            <Link href="/events" className="btn btn-primary">Browse events</Link>
            <Link href="/cities" className="btn btn-ghost">Explore cities</Link>
          </div>
        </div>
      </section>

      <section style={{marginTop:12}}>
        <h3>What you can do</h3>
        <div className="grid grid--tight" style={{marginTop:10}}>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Browse curated events</div>
                <div className="card-sub">Filter by city or type to find what you like.</div>
              </div>
              <div className="badge">Free</div>
            </div>
          </article>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Discover venues</div>
                <div className="card-sub">See venue bios and upcoming schedules.</div>
              </div>
              <div className="badge">Local</div>
            </div>
          </article>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Add events</div>
                <div className="card-sub">Share your event with the community quickly.</div>
              </div>
              <div className="badge">Quick</div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
