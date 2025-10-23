import React, { forwardRef } from 'react';
import './Button.css';

/**
 * ButtonVariant - Available button style variants
 * 
 * Defines the visual appearance of the button with predefined color schemes
 * and styling patterns for different use cases.
 * 
 * @typedef {('primary'|'secondary'|'outline'|'ghost'|'danger'|'success'|'warning')} ButtonVariant
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';

/**
 * ButtonSize - Available button sizes
 * 
 * Defines the size variations for buttons, affecting padding, font size,
 * and overall dimensions.
 * 
 * @typedef {('sm'|'md'|'lg'|'xl')} ButtonSize
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * ButtonProps - Props for the Button component
 * 
 * Extends native HTML button attributes with additional customization options
 * for styling, loading states, and icon support.
 * 
 * @typedef {Object} ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @property {ButtonVariant} [variant='primary'] - Visual style variant
 * @property {ButtonSize} [size='md'] - Button size
 * @property {boolean} [isLoading=false] - Loading state indicator
 * @property {string} [loadingText='Loading...'] - Text to show when loading
 * @property {React.ReactNode} [leftIcon] - Icon to display on the left side
 * @property {React.ReactNode} [rightIcon] - Icon to display on the right side
 * @property {boolean} [fullWidth=false] - Whether button should take full width
 * @property {React.ReactNode} children - Button content/label
 */
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

/**
 * Button - Reusable button component with multiple variants and states
 * 
 * A flexible button component that supports different visual styles, sizes,
 * loading states, and icons. Extends native HTML button attributes for
 * full compatibility with standard button behavior including click handlers,
 * form submission, and accessibility features.
 * 
 * Features:
 * - Multiple style variants (primary, secondary, outline, ghost, danger, success, warning)
 * - Four size options (sm, md, lg, xl)
 * - Loading state with spinner animation
 * - Support for left and right icons
 * - Full-width layout option
 * - Automatic disabled state during loading
 * - Forward ref support for parent component access
 * 
 * @component
 * @param {ButtonProps} props - Component props
 * @param {ButtonVariant} [props.variant='primary'] - Visual style (primary, secondary, outline, ghost, danger, success, warning)
 * @param {ButtonSize} [props.size='md'] - Button size (sm, md, lg, xl)
 * @param {boolean} [props.isLoading=false] - Shows loading spinner and disables button
 * @param {string} [props.loadingText='Loading...'] - Text shown during loading state
 * @param {React.ReactNode} [props.leftIcon] - Icon component to display before the label
 * @param {React.ReactNode} [props.rightIcon] - Icon component to display after the label
 * @param {boolean} [props.fullWidth=false] - Makes button expand to full container width
 * @param {boolean} [props.disabled] - Disables the button
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button label or content
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to the button element
 * 
 * @returns {JSX.Element} Rendered button element
 * 
 * @example
 * // Basic button
 * <Button>Click me</Button>
 * 
 * @example
 * // Primary button with icon
 * <Button variant="primary" leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 * 
 * @example
 * // Danger button with loading state
 * <Button 
 *   variant="danger" 
 *   isLoading={isDeleting}
 *   loadingText="Deleting..."
 *   onClick={handleDelete}
 * >
 *   Delete
 * </Button>
 * 
 * @example
 * // Full width secondary button
 * <Button variant="secondary" size="lg" fullWidth>
 *   Submit Form
 * </Button>
 * 
 * @example
 * // Outline button with both icons
 * <Button 
 *   variant="outline" 
 *   leftIcon={<DownloadIcon />}
 *   rightIcon={<ArrowIcon />}
 * >
 *   Download Report
 * </Button>
 * 
 * @example
 * // Using ref for focus management
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * 
 * const focusButton = () => {
 *   buttonRef.current?.focus();
 * };
 * 
 * <Button ref={buttonRef}>Focus me</Button>
 * 
 * @see {@link ButtonVariant} for available style options
 * @see {@link ButtonSize} for available size options
 */
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
