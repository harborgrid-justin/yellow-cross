import React, { forwardRef } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Loading...',
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const fullWidthClass = fullWidth ? 'btn--full-width' : '';
    const loadingClass = isLoading ? 'btn--loading' : '';
    
    const classes = [
      baseClasses,
      variantClass,
      sizeClass,
      fullWidthClass,
      loadingClass,
      className
    ].filter(Boolean).join(' ');

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span className="btn__spinner" aria-hidden="true">
            <svg className="btn__spinner-icon" viewBox="0 0 24 24">
              <circle
                className="btn__spinner-circle"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </span>
        )}
        
        {!isLoading && leftIcon && (
          <span className="btn__icon btn__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <span className="btn__content">
          {isLoading ? loadingText : children}
        </span>
        
        {!isLoading && rightIcon && (
          <span className="btn__icon btn__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
