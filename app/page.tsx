'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Page() {
  const { t } = useLanguage();
  
  return (
    <div>
      <section className="hero card">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <h2 style={{margin:0,fontSize:28}}>{t('home.title')}</h2>
          <p className="muted" style={{margin:0}}>{t('home.subtitle')}</p>
          <div style={{marginTop:14,display:'flex',gap:12}}>
            <Link href="/events" className="btn btn-primary">{t('home.browseEvents')}</Link>
            <Link href="/cities" className="btn btn-ghost">{t('home.exploreCities')}</Link>
          </div>
        </div>
      </section>

      <section style={{marginTop:12}}>
        <h3>{t('home.whatYouCanDo')}</h3>
        <div className="grid grid--tight" style={{marginTop:10}}>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{t('home.browseTitle')}</div>
                <div className="card-sub">{t('home.browseDesc')}</div>
              </div>
              <div className="badge">{t('home.badgeFree')}</div>
            </div>
          </article>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{t('home.discoverTitle')}</div>
                <div className="card-sub">{t('home.discoverDesc')}</div>
              </div>
              <div className="badge">{t('home.badgeLocal')}</div>
            </div>
          </article>
          <article className="card">
            <div className="card-head">
              <div>
                <div className="card-title">{t('home.addTitle')}</div>
                <div className="card-sub">{t('home.addDesc')}</div>
              </div>
              <div className="badge">{t('home.badgeQuick')}</div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
