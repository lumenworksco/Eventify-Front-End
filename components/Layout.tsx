import type { ReactNode } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="site-wrap">
      <div className="container">
        <header className="site-header">
          <div className="logo" style={{ alignItems: 'center' }}>
            <div className="logo-mark">E</div>
            <h1 style={{ margin: 0 }}>Eventify</h1>
          </div>

          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/cities">Cities</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li className="nav-cta">
                <Link href="/events/new">Add Event</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <main style={{ flex: 1 }}>
        <div className="container">{children}</div>
      </main>

      <footer className="site-footer container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div className="small">© {new Date().getFullYear()} Eventify</div>
          <div className="small u-muted">Built for learning — UCLL Full Stack</div>
        </div>
      </footer>
    </div>
  );
}
