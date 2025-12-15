'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * Inner component that uses useSearchParams
 */
function VenueRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const idParam = searchParams.get('id');
  const venueId = idParam ? parseInt(idParam) : 0;

  useEffect(() => {
    if (venueId) {
      // Redirect to the new dynamic route
      router.replace(`/venue/${venueId}`);
    }
  }, [venueId, router]);

  if (!venueId) {
    return (
      <div>
        <h2>{t('venue.notFound')}</h2>
        <div className="card">
          {t('venue.idMissing')}
          <a href="/cities" className="btn btn-ghost" style={{ marginLeft: 8 }}>
            {t('venue.browseCities')}
          </a>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div>
      <LoadingSpinner message={t('common.loading')} />
    </div>
  );
}

/**
 * This page handles the legacy /venue?id=X route format.
 * It redirects to the new dynamic route /venue/X for backwards compatibility.
 */
export default function VenuePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VenueRedirect />
    </Suspense>
  );
}
