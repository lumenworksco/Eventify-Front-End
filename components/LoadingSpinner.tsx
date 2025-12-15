'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable LoadingSpinner component
 * Shows loading state with optional message
 */
export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: { spinner: 16, text: '0.875rem' },
    medium: { spinner: 24, text: '1rem' },
    large: { spinner: 32, text: '1.125rem' },
  };

  const { spinner: spinnerSize, text: textSize } = sizeClasses[size];

  return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <div 
        style={{ 
          display: 'inline-block',
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #e2e8f0',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} 
      />
      <p style={{ marginTop: '0.75rem', fontSize: textSize }} className="muted">
        {message}
      </p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
