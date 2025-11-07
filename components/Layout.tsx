import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <header className="site-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: '#eef2ff',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#2563eb',
            }}
          >
            E
          </div>
          <h1>Eventify</h1>
        </div>
        <nav className="site-nav" style={{ marginTop: 8 }} aria-label="Main navigation">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/cities">Cities</a>
            </li>
            <li>
              <a href="/events">Events</a>
            </li>
            <li>
              <a href="/events/new">Add Event</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">© Eventify</footer>
    </div>
  );
}
