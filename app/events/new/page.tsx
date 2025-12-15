'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVenues } from '../../../hooks/useApi';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { api, CreateEventDTO, ApiError } from '../../../services/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';

interface FormState {
  title: string;
  venueIds: number[];
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  availableTickets: string;
  type: string;
}

interface ResultState {
  success: boolean;
  message?: string;
  errors?: string[];
}

export default function NewEventPage() {
  const router = useRouter();
  const { isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  // Using useSWR via useVenues hook instead of useEffect
  const { data: venues, error: venuesError, isLoading: venuesLoading, mutate: mutateVenues } = useVenues();
  
  const [submitting, setSubmitting] = useState(false);
  
  const initialForm: FormState = {
    title: '',
    venueIds: [],
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    availableTickets: '',
    type: ''
  };
  
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<ResultState | null>(null);

  // Set default venue when venues load
  useEffect(() => {
    if (venues && venues.length > 0 && form.venueIds.length === 0) {
      setForm(prev => ({ ...prev, venueIds: [venues[0].venueId] }));
    }
  }, [venues, form.venueIds.length]);

  // Authorization check - must be ADMIN or ORGANIZER
  if (!authLoading && !isAuthenticated) {
    return (
      <div>
        <h2>{t('addEvent.title')}</h2>
        <div className="card" style={{ color: '#ef4444' }}>
          {t('addEvent.loginRequired')}
          <a href="/login" className="btn btn-primary" style={{ marginLeft: 12 }}>
            {t('nav.login')}
          </a>
        </div>
      </div>
    );
  }

  if (!authLoading && isAuthenticated && !hasRole(['ADMIN', 'ORGANIZER'])) {
    return (
      <div>
        <h2>{t('addEvent.title')}</h2>
        <div className="card" style={{ color: '#ef4444' }}>
          {t('addEvent.noPermission')}
        </div>
      </div>
    );
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    
    if (name === 'venueIds' && e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
      setForm(prev => ({ ...prev, venueIds: selectedOptions }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function validateForm(): string[] {
    const errors: string[] = [];
    
    if (!form.title.trim()) {
      errors.push(t('validation.titleRequired'));
    } else if (form.title.trim().length < 2) {
      errors.push(t('validation.titleMinLength'));
    }
    
    if (form.venueIds.length === 0) {
      errors.push(t('validation.venueRequired'));
    }
    
    if (!form.date) {
      errors.push(t('validation.dateRequired'));
    } else {
      const eventDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        errors.push(t('validation.dateNotPast'));
      }
    }
    
    if (!form.startTime) {
      errors.push(t('validation.startTimeRequired'));
    }
    
    if (!form.endTime) {
      errors.push(t('validation.endTimeRequired'));
    }
    
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      errors.push(t('validation.endTimeAfterStart'));
    }
    
    if (form.availableTickets && parseInt(form.availableTickets) < 0) {
      errors.push(t('validation.ticketsPositive'));
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
      
      const eventDTO: CreateEventDTO = {
        title: form.title.trim(),
        eventDate: form.date,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00',
        availableTickets: form.availableTickets ? parseInt(form.availableTickets) : null,
        venueIds: form.venueIds,
      };
      
      const createdEvent = await api.createEvent(eventDTO);
      
      setResult({ 
        success: true, 
        message: t('addEvent.success').replace('{title}', createdEvent.title)
      });
      
      setForm({
        ...initialForm,
        venueIds: venues && venues.length > 0 ? [venues[0].venueId] : []
      });
      
    } catch (err: any) {
      const apiError = err as ApiError;
      setResult({ 
        success: false, 
        errors: [apiError.message || t('addEvent.createFailed')] 
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm({
      ...initialForm,
      venueIds: venues && venues.length > 0 ? [venues[0].venueId] : []
    });
    setResult(null);
  }

  if (authLoading || venuesLoading) {
    return (
      <div>
        <h2>{t('addEvent.title')}</h2>
        <LoadingSpinner message={t('common.loading')} />
      </div>
    );
  }

  if (venuesError) {
    return (
      <div>
        <h2>{t('addEvent.title')}</h2>
        <ErrorMessage 
          message={venuesError.message} 
          onRetry={() => mutateVenues()}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>{t('addEvent.title')}</h2>
      <p className="small muted">{t('addEvent.subtitle')}</p>
      
      <form onSubmit={submit} className="card" aria-label="Add event form">
        <div className="form-grid">
          <div>
            <label className="small">{t('addEvent.titleField')} *</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={onChange} 
              placeholder={t('addEvent.titleField')}
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="small">{t('addEvent.venue')} * <span className="muted">{t('addEvent.venueHint')}</span></label>
            <select 
              name="venueIds" 
              value={form.venueIds.map(String)} 
              onChange={onChange}
              multiple
              size={Math.min((venues || []).length, 4)}
              required
            >
              {(venues || []).map(v => (
                <option key={v.venueId} value={v.venueId}>
                  {v.name} ({v.city.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="small">{t('addEvent.date')} *</label>
            <input 
              name="date" 
              type="date" 
              value={form.date} 
              onChange={onChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="small">{t('addEvent.type')}</label>
            <input 
              name="type" 
              value={form.type} 
              onChange={onChange} 
              placeholder={t('addEvent.typePlaceholder')}
            />
          </div>
          <div>
            <label className="small">{t('addEvent.startTime')} *</label>
            <input 
              name="startTime" 
              type="time" 
              value={form.startTime} 
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="small">{t('addEvent.endTime')} *</label>
            <input 
              name="endTime" 
              type="time" 
              value={form.endTime} 
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="small">{t('addEvent.availableTickets')}</label>
            <input 
              name="availableTickets" 
              type="number" 
              value={form.availableTickets} 
              onChange={onChange}
              placeholder={t('addEvent.ticketsPlaceholder')}
              min="0"
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="small">{t('addEvent.description')}</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={onChange} 
            placeholder={t('addEvent.descriptionPlaceholder')}
          />
        </div>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ marginLeft: 'auto' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? t('addEvent.saving') : t('addEvent.save')}
            </button>
            <button 
              type="button" 
              className="btn btn-ghost" 
              style={{ marginLeft: 8 }} 
              onClick={resetForm}
              disabled={submitting}
            >
              {t('addEvent.reset')}
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="card" style={{ marginTop: 12 }}>
          {result.success ? (
            <div style={{ color: 'green' }}>✓ {result.message}</div>
          ) : (
            <div>
              <strong style={{ color: 'red' }}>{t('addEvent.validationErrors')}</strong>
              <ul>
                {result.errors?.map((er, i) => (
                  <li key={i} style={{ color: 'red' }}>{er}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
