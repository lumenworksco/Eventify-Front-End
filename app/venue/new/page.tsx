'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { api, CreateVenueDTO, ApiError, City } from '../../../services/api';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface FormState {
  name: string;
  address: string;
  capacity: string;
  cityId: number | null;
}

interface ResultState {
  success: boolean;
  message?: string;
  errors?: string[];
}

export default function NewVenuePage() {
  const router = useRouter();
  const { isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const initialForm: FormState = {
    name: '',
    address: '',
    capacity: '',
    cityId: null
  };
  
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<ResultState | null>(null);

  // Fetch cities on mount
  useEffect(() => {
    async function fetchCities() {
      try {
        const citiesData = await api.getAllCities();
        setCities(citiesData);
        if (citiesData.length > 0) {
          setForm(prev => ({ ...prev, cityId: citiesData[0].cityId }));
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setCitiesLoading(false);
      }
    }
    fetchCities();
  }, []);

  // Authorization check - must be ADMIN
  if (!authLoading && !isAuthenticated) {
    return (
      <div>
        <h2>{t('addVenue.title')}</h2>
        <div className="card" style={{ color: '#ef4444' }}>
          {t('addVenue.loginRequired')}
          <a href="/login" className="btn btn-primary" style={{ marginLeft: 12 }}>
            {t('nav.login')}
          </a>
        </div>
      </div>
    );
  }

  if (!authLoading && isAuthenticated && !hasRole(['ADMIN'])) {
    return (
      <div>
        <h2>{t('addVenue.title')}</h2>
        <div className="card" style={{ color: '#ef4444' }}>
          {t('addVenue.noPermission')}
        </div>
      </div>
    );
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    
    if (name === 'cityId') {
      setForm(prev => ({ ...prev, cityId: parseInt(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function validateForm(): string[] {
    const errors: string[] = [];
    
    if (!form.name.trim()) {
      errors.push(t('addVenue.validation.nameRequired'));
    } else if (form.name.trim().length < 2) {
      errors.push(t('addVenue.validation.nameMinLength'));
    }
    
    if (!form.cityId) {
      errors.push(t('addVenue.validation.cityRequired'));
    }
    
    if (form.capacity && parseInt(form.capacity) < 1) {
      errors.push(t('addVenue.validation.capacityPositive'));
    }
    
    return errors;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setResult({ success: false, errors: validationErrors });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const venueDTO: CreateVenueDTO = {
        name: form.name.trim(),
        address: form.address.trim() || undefined,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        cityId: form.cityId!,
      };
      
      const createdVenue = await api.createVenue(venueDTO);
      
      setResult({ 
        success: true, 
        message: t('addVenue.success').replace('{name}', createdVenue.name)
      });
      
      setForm({
        ...initialForm,
        cityId: cities.length > 0 ? cities[0].cityId : null
      });
      
    } catch (err: any) {
      const apiError = err as ApiError;
      setResult({ 
        success: false, 
        errors: [apiError.message || t('addVenue.createFailed')] 
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm({
      ...initialForm,
      cityId: cities.length > 0 ? cities[0].cityId : null
    });
    setResult(null);
  }

  if (authLoading || citiesLoading) {
    return (
      <div>
        <h2>{t('addVenue.title')}</h2>
        <LoadingSpinner message={t('common.loading')} />
      </div>
    );
  }

  return (
    <div>
      <h2>{t('addVenue.title')}</h2>
      <p className="muted" style={{ marginBottom: 24 }}>{t('addVenue.subtitle')}</p>
      
      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={submit}>
          {/* Result message */}
          {result && (
            <div 
              style={{ 
                marginBottom: 16, 
                padding: 12, 
                borderRadius: 6,
                backgroundColor: result.success ? '#dcfce7' : '#fee2e2',
                color: result.success ? '#166534' : '#991b1b'
              }}
            >
              {result.success ? (
                <p style={{ margin: 0 }}>{result.message}</p>
              ) : (
                <div>
                  <strong>{t('addEvent.validationErrors')}</strong>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                    {result.errors?.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Venue Name */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              {t('addVenue.nameField')} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              placeholder={t('addVenue.namePlaceholder')}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: 6, 
                border: '1px solid var(--border)' 
              }}
            />
          </div>
          
          {/* City */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="cityId" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              {t('addVenue.city')} *
            </label>
            <select
              id="cityId"
              name="cityId"
              value={form.cityId || ''}
              onChange={onChange}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: 6, 
                border: '1px solid var(--border)' 
              }}
            >
              {cities.map(city => (
                <option key={city.cityId} value={city.cityId}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          </div>
          
          {/* Address */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="address" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              {t('addVenue.address')}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={onChange}
              placeholder={t('addVenue.addressPlaceholder')}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: 6, 
                border: '1px solid var(--border)' 
              }}
            />
          </div>
          
          {/* Capacity */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label htmlFor="capacity" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              {t('addVenue.capacity')}
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={onChange}
              placeholder={t('addVenue.capacityPlaceholder')}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: 6, 
                border: '1px solid var(--border)' 
              }}
            />
          </div>
          
          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? t('addVenue.saving') : t('addVenue.save')}
            </button>
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={resetForm}
              disabled={submitting}
            >
              {t('addVenue.reset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
