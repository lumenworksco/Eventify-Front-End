'use client';
import { useLanguage } from '../context/LanguageContext';

/**
 * Language Selector component
 * Allows users to switch between supported languages (English, French, German)
 * Styled consistently with the rest of the application
 */
export default function LanguageSelector() {
  const { locale, setLocale, t, availableLocales } = useLanguage();

  const currentLocale = availableLocales.find(l => l.code === locale);

  return (
    <div 
      className="language-selector" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
      }}
    >
      <select 
        value={locale} 
        onChange={(e) => setLocale(e.target.value as 'en' | 'fr' | 'de')}
        style={{ 
          padding: '0.5rem 0.75rem',
          paddingRight: '2rem',
          fontSize: '14px',
          fontFamily: 'inherit',
          fontWeight: 600,
          borderRadius: '10px',
          border: '1px solid #e6edf3',
          background: 'var(--surface)',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          transition: 'all .18s ease',
          color: '#0f172a',
          minWidth: '140px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e6edf3';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e6edf3';
        }}
        aria-label={t('language.switch')}
      >
        {availableLocales.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
