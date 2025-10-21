import React, { forwardRef, useState } from 'react';
import './Input.css';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      variant = 'outline',
      isRequired = false,
      isInvalid = false,
      isDisabled = false,
      fullWidth = false,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = isInvalid || !!error;
    const isPasswordType = type === 'password';

    const containerClasses = [
      'input-container',
      `input-container--${variant}`,
      `input-container--${size}`,
      fullWidth && 'input-container--full-width',
      hasError && 'input-container--error',
      isDisabled && 'input-container--disabled',
      isFocused && 'input-container--focused',
      className
    ].filter(Boolean).join(' ');

    const inputClasses = [
      'input',
      `input--${variant}`,
      `input--${size}`,
      leftIcon && 'input--has-left-icon',
      (rightIcon || isPasswordType) && 'input--has-right-icon',
      hasError && 'input--error',
    ].filter(Boolean).join(' ');

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {isRequired && <span className="input-label__required">*</span>}
          </label>
        )}
        
        <div className="input-wrapper">
          {leftIcon && (
            <div className="input-icon input-icon--left" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={isDisabled}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : 
              helperText ? `${inputId}-helper` : 
              undefined
            }
            {...props}
          />
          
          {(rightIcon || isPasswordType) && (
            <div className="input-icon input-icon--right">
              {isPasswordType ? (
                <button
                  type="button"
                  className="input-password-toggle"
                  onClick={handleTogglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div id={`${inputId}-error`} className="input-error" role="alert">
            <svg className="input-error__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${inputId}-helper`} className="input-helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
