import React, { forwardRef } from 'react';
import './Checkbox.css';

/**
 * CheckboxProps - Props for the Checkbox component
 * 
 * @typedef {Object} CheckboxProps
 * @extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>
 * @property {string} [label] - Label text for the checkbox
 * @property {string} [description] - Additional description text
 * @property {('sm'|'md'|'lg')} [size='md'] - Checkbox size
 * @property {('default'|'card')} [variant='default'] - Visual style variant
 * @property {boolean} [indeterminate=false] - Indeterminate state
 * @property {string} [error] - Error message
 * @property {string} [helperText] - Helper text below checkbox
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
  indeterminate?: boolean;
  error?: string;
  helperText?: string;
}

/**
 * Checkbox - Customizable checkbox input component
 * 
 * A styled checkbox component with support for labels, descriptions,
 * error states, indeterminate state, and multiple visual variants.
 * 
 * Features:
 * - Optional label and description
 * - Three size options (sm, md, lg)
 * - Two visual variants (default, card)
 * - Indeterminate state support
 * - Error handling with messages
 * - Helper text support
 * - Forward ref support
 * 
 * @component
 * @param {CheckboxProps} props - Component props
 * @param {string} [props.label] - Checkbox label text
 * @param {string} [props.description] - Additional description
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Size variant
 * @param {('default'|'card')} [props.variant='default'] - Style variant
 * @param {boolean} [props.indeterminate=false] - Indeterminate state
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.helperText] - Helper text
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref
 * 
 * @returns {JSX.Element} Checkbox component
 * 
 * @example
 * // Basic checkbox
 * <Checkbox label="Accept terms" />
 * 
 * @example
 * // Checkbox with description
 * <Checkbox 
 *   label="Subscribe to newsletter"
 *   description="Receive updates about new features"
 * />
 * 
 * @example
 * // Checkbox with error
 * <Checkbox 
 *   label="Required field"
 *   error="This field is required"
 * />
 * 
 * @example
 * // Indeterminate checkbox
 * <Checkbox 
 *   label="Select all"
 *   indeterminate={someSelected && !allSelected}
 * />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      size = 'md',
      variant = 'default',
      indeterminate = false,
      error,
      helperText,
      className = '',
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const containerClasses = [
      'checkbox-container',
      `checkbox-container--${size}`,
      `checkbox-container--${variant}`,
      hasError && 'checkbox-container--error',
      disabled && 'checkbox-container--disabled',
      className
    ].filter(Boolean).join(' ');

    const checkboxClasses = [
      'checkbox',
      `checkbox--${size}`,
      hasError && 'checkbox--error',
      indeterminate && 'checkbox--indeterminate'
    ].filter(Boolean).join(' ');

    // Handle indeterminate state
    React.useEffect(() => {
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    return (
      <div className={containerClasses}>
        <div className="checkbox-wrapper">
          <div className="checkbox-input-wrapper">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={checkboxClasses}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={
                error ? `${checkboxId}-error` : 
                helperText ? `${checkboxId}-helper` : 
                description ? `${checkboxId}-description` : 
                undefined
              }
              {...props}
            />
            <div className="checkbox-indicator">
              {indeterminate ? (
                <svg className="checkbox-icon" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 8h8v1H4z"/>
                </svg>
              ) : (
                <svg className="checkbox-icon" viewBox="0 0 16 16" fill="currentColor">
                  <path d="m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z"/>
                </svg>
              )}
            </div>
          </div>
          
          {(label || description) && (
            <div className="checkbox-content">
              {label && (
                <label htmlFor={checkboxId} className="checkbox-label">
                  {label}
                </label>
              )}
              {description && (
                <div id={`${checkboxId}-description`} className="checkbox-description">
                  {description}
                </div>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div id={`${checkboxId}-error`} className="checkbox-error" role="alert">
            <svg className="checkbox-error__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${checkboxId}-helper`} className="checkbox-helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Checkbox Group Component
export interface CheckboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
  disabled?: boolean;
  className?: string;
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      options,
      value,
      defaultValue = [],
      onChange,
      name,
      size = 'md',
      variant = 'default',
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      value || defaultValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(value);
      }
    }, [value]);

    const handleChange = (optionValue: string, checked: boolean) => {
      let newValues: string[];
      
      if (checked) {
        newValues = [...selectedValues, optionValue];
      } else {
        newValues = selectedValues.filter(v => v !== optionValue);
      }
      
      setSelectedValues(newValues);
      onChange?.(newValues);
    };

    const groupClasses = [
      'checkbox-group',
      `checkbox-group--${size}`,
      `checkbox-group--${variant}`,
      disabled && 'checkbox-group--disabled',
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={groupClasses} role="group">
        {options.map((option, index) => (
          <Checkbox
            key={option.value}
            name={name}
            label={option.label}
            description={option.description}
            size={size}
            variant={variant}
            disabled={disabled || option.disabled}
            checked={selectedValues.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
          />
        ))}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
