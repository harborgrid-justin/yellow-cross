import React, { forwardRef } from 'react';
import './Spinner.css';

/**
 * SpinnerProps - Props for the Spinner component
 * 
 * Configuration options for loading spinner animations with various
 * visual styles and sizes.
 * 
 * @typedef {Object} SpinnerProps
 * @extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'>
 * @property {('default'|'dots'|'pulse'|'ring'|'bars'|'legal'|'minimal')} [variant='default'] - Animation style
 * @property {('xs'|'sm'|'md'|'lg'|'xl')} [size='md'] - Spinner size
 * @property {('primary'|'secondary'|'success'|'warning'|'danger'|'info'|'current')} [color='primary'] - Color theme
 * @property {string} [label='Loading...'] - Accessible label text
 * @property {boolean} [showLabel=false] - Display label visibly
 * @property {('top'|'bottom'|'left'|'right')} [labelPosition='bottom'] - Label placement
 * @property {string} [className] - Additional CSS classes
 * @property {('slow'|'normal'|'fast')} [speed='normal'] - Animation speed
 * @property {boolean} [visible=true] - Control visibility
 */
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  /** Spinner variant */
  variant?: 'default' | 'dots' | 'pulse' | 'ring' | 'bars' | 'legal' | 'minimal';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'current';
  /** Loading text */
  label?: string;
  /** Whether to show label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Custom class name */
  className?: string;
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast';
  /** Whether spinner is visible */
  visible?: boolean;
}

/**
 * Spinner - Loading indicator component
 * 
 * A versatile loading spinner with multiple animation styles, sizes,
 * and colors. Used to indicate loading states, processing, or pending
 * operations throughout the application.
 * 
 * Features:
 * - Seven animation variants
 * - Five size options (xs to xl)
 * - Multiple color themes
 * - Optional visible label
 * - Configurable animation speed
 * - Visibility control
 * - Accessible with ARIA labels
 * - Forward ref support
 * 
 * @component
 * @param {SpinnerProps} props - Component props
 * @param {string} [props.variant='default'] - Animation style (default, dots, pulse, ring, bars, legal, minimal)
 * @param {string} [props.size='md'] - Size (xs, sm, md, lg, xl)
 * @param {string} [props.color='primary'] - Color theme
 * @param {string} [props.label='Loading...'] - Screen reader label
 * @param {boolean} [props.showLabel=false] - Show label text visibly
 * @param {string} [props.labelPosition='bottom'] - Label position relative to spinner
 * @param {string} [props.speed='normal'] - Animation speed (slow, normal, fast)
 * @param {boolean} [props.visible=true] - Control visibility
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * 
 * @returns {JSX.Element|null} Spinner component or null if not visible
 * 
 * @example
 * // Basic spinner
 * <Spinner />
 * 
 * @example
 * // Large spinner with label
 * <Spinner 
 *   size="lg" 
 *   showLabel 
 *   label="Loading cases..."
 * />
 * 
 * @example
 * // Dots variant with custom color
 * <Spinner 
 *   variant="dots"
 *   color="success"
 *   speed="fast"
 * />
 * 
 * @example
 * // Conditional visibility
 * <Spinner 
 *   variant="ring"
 *   visible={isLoading}
 *   label="Processing request..."
 * />
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({
    variant = 'default',
    size = 'md',
    color = 'primary',
    label = 'Loading...',
    showLabel = false,
    labelPosition = 'bottom',
    className = '',
    speed = 'normal',
    visible = true,
    ...props
  }, ref) => {
    if (!visible) return null;

    // Component classes
    const spinnerClasses = [
      'spinner',
      `spinner--${variant}`,
      `spinner--${size}`,
      `spinner--${color}`,
      `spinner--${speed}`,
      showLabel && `spinner--label-${labelPosition}`,
      className
    ].filter(Boolean).join(' ');

    // Render spinner content based on variant
    const renderSpinnerContent = () => {
      switch (variant) {
        case 'dots':
          return (
            <div className="spinner__content">
              <div className="spinner__dot"></div>
              <div className="spinner__dot"></div>
              <div className="spinner__dot"></div>
            </div>
          );
        
        case 'pulse':
          return (
            <div className="spinner__content">
              <div className="spinner__pulse"></div>
            </div>
          );
        
        case 'ring':
          return (
            <div className="spinner__content">
              <div className="spinner__ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          );
        
        case 'bars':
          return (
            <div className="spinner__content">
              <div className="spinner__bars">
                <div className="spinner__bar"></div>
                <div className="spinner__bar"></div>
                <div className="spinner__bar"></div>
                <div className="spinner__bar"></div>
                <div className="spinner__bar"></div>
              </div>
            </div>
          );
        
        case 'legal':
          return (
            <div className="spinner__content">
              <svg className="spinner__legal" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  fill="currentColor"
                  opacity="0.4"
                />
                <path
                  d="M2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        
        case 'minimal':
          return (
            <div className="spinner__content">
              <div className="spinner__minimal"></div>
            </div>
          );
        
        default:
          return (
            <div className="spinner__content">
              <svg className="spinner__default" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="31.416"
                  strokeDashoffset="31.416"
                />
              </svg>
            </div>
          );
      }
    };

    const renderLabel = () => {
      if (!showLabel || !label) return null;
      
      return (
        <div className="spinner__label" aria-live="polite">
          {label}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={spinnerClasses}
        role="status"
        aria-label={showLabel ? undefined : label}
        {...props}
      >
        {labelPosition === 'top' && renderLabel()}
        {labelPosition === 'left' && renderLabel()}
        {renderSpinnerContent()}
        {labelPosition === 'right' && renderLabel()}
        {labelPosition === 'bottom' && renderLabel()}
      </div>
    );
  }
);

// Preset spinner variants
export const LoadingSpinner = (props: Omit<SpinnerProps, 'showLabel' | 'label'>) => (
  <Spinner {...props} showLabel label="Loading..." />
);

export const SaveSpinner = (props: Omit<SpinnerProps, 'showLabel' | 'label'>) => (
  <Spinner {...props} showLabel label="Saving..." />
);

export const ProcessingSpinner = (props: Omit<SpinnerProps, 'showLabel' | 'label'>) => (
  <Spinner {...props} showLabel label="Processing..." />
);

export const LegalSpinner = (props: Omit<SpinnerProps, 'variant'>) => (
  <Spinner {...props} variant="legal" />
);

export const MinimalSpinner = (props: Omit<SpinnerProps, 'variant'>) => (
  <Spinner {...props} variant="minimal" />
);

// Overlay spinner for full-page loading
export const OverlaySpinner = ({
  children,
  loading = false,
  spinnerProps = {},
  overlayClassName = ''
}: {
  children: React.ReactNode;
  loading?: boolean;
  spinnerProps?: Omit<SpinnerProps, 'visible'>;
  overlayClassName?: string;
}) => {
  return (
    <div className="spinner-overlay-container">
      {children}
      {loading && (
        <div className={`spinner-overlay ${overlayClassName}`}>
          <Spinner
            visible
            showLabel
            size="lg"
            label="Loading..."
            {...spinnerProps}
          />
        </div>
      )}
    </div>
  );
};

// Inline spinner for buttons and small areas
export const InlineSpinner = (props: Omit<SpinnerProps, 'size' | 'showLabel'>) => (
  <Spinner {...props} size="xs" showLabel={false} />
);

// Button spinner that replaces button content while loading
export const ButtonSpinner = ({
  loading = false,
  children,
  spinnerProps = {}
}: {
  loading?: boolean;
  children: React.ReactNode;
  spinnerProps?: Omit<SpinnerProps, 'visible' | 'size' | 'showLabel'>;
}) => {
  if (loading) {
    return (
      <Spinner
        visible
        size="xs"
        showLabel={false}
        color="current"
        {...spinnerProps}
      />
    );
  }
  
  return <>{children}</>;
};

// Page spinner for route transitions
export const PageSpinner = (props: Omit<SpinnerProps, 'size' | 'showLabel' | 'labelPosition'>) => (
  <div className="page-spinner">
    <Spinner
      {...props}
      size="xl"
      showLabel
      labelPosition="bottom"
      label="Loading page..."
    />
  </div>
);

// Hook for spinner state management
export const useSpinner = (initialLoading = false) => {
  const [loading, setLoading] = React.useState(initialLoading);
  const [label, setLabel] = React.useState('Loading...');

  const startLoading = (newLabel?: string) => {
    if (newLabel) setLabel(newLabel);
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    loadingLabel?: string
  ): Promise<T> => {
    startLoading(loadingLabel);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    loading,
    setLoading,
    label,
    setLabel,
    startLoading,
    stopLoading,
    withLoading
  };
};

Spinner.displayName = 'Spinner';
