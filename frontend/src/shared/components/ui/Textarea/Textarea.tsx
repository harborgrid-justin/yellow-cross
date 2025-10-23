import React, { forwardRef, useState, useRef, useEffect, useId } from 'react';
import './Textarea.css';

/**
 * TextareaProps - Props for the Textarea component
 * 
 * @typedef {Object} TextareaProps
 * @extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>
 * @property {('default'|'filled'|'outlined'|'legal'|'minimal')} [variant='default'] - Visual style
 * @property {('sm'|'md'|'lg')} [size='md'] - Size variant
 * @property {boolean} [error=false] - Error state
 * @property {string} [errorMessage] - Error message text
 * @property {boolean} [success=false] - Success state
 * @property {string} [successMessage] - Success message text
 * @property {string} [helperText] - Helper text
 * @property {React.ReactNode} [label] - Label text
 * @property {boolean} [required=false] - Required field indicator
 * @property {boolean} [showCount=false] - Show character count
 * @property {number} [maxLength] - Maximum character count
 * @property {boolean} [autoResize=false] - Auto-resize based on content
 * @property {number} [minRows] - Minimum rows
 * @property {number} [maxRows] - Maximum rows
 * @property {('none'|'both'|'horizontal'|'vertical')} [resize='vertical'] - Resize behavior
 * @property {React.ReactNode} [startAdornment] - Start adornment
 * @property {React.ReactNode} [endAdornment] - End adornment
 */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Textarea variant */
  variant?: 'default' | 'filled' | 'outlined' | 'legal' | 'minimal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether textarea has error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Success state */
  success?: boolean;
  /** Success message */
  successMessage?: string;
  /** Helper text */
  helperText?: string;
  /** Label text */
  label?: React.ReactNode;
  /** Whether label is required */
  required?: boolean;
  /** Whether to show character count */
  showCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Whether to auto-resize based on content */
  autoResize?: boolean;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows */
  maxRows?: number;
  /** Resize behavior */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /** Custom class name */
  className?: string;
  /** Start adornment */
  startAdornment?: React.ReactNode;
  /** End adornment */
  endAdornment?: React.ReactNode;
}

/**
 * Textarea - Multi-line text input component
 * 
 * An enhanced textarea component with support for labels, validation,
 * character counting, auto-resizing, and various visual variants.
 * 
 * Features:
 * - Five visual variants (default, filled, outlined, legal, minimal)
 * - Three size options (sm, md, lg)
 * - Error and success states with messages
 * - Character counter with max length
 * - Auto-resize based on content
 * - Min/max rows configuration
 * - Customizable resize behavior
 * - Start and end adornments
 * - Helper text support
 * - Forward ref support
 * 
 * @component
 * @param {TextareaProps} props - Component props
 * @param {string} [props.variant='default'] - Visual style
 * @param {string} [props.size='md'] - Size variant
 * @param {boolean} [props.error=false] - Error state
 * @param {string} [props.errorMessage] - Error message
 * @param {boolean} [props.success=false] - Success state
 * @param {string} [props.successMessage] - Success message
 * @param {string} [props.helperText] - Helper text
 * @param {React.ReactNode} [props.label] - Label
 * @param {boolean} [props.required=false] - Required indicator
 * @param {boolean} [props.showCount=false] - Show character count
 * @param {number} [props.maxLength] - Max characters
 * @param {boolean} [props.autoResize=false] - Auto-resize
 * @param {number} [props.minRows] - Minimum rows
 * @param {number} [props.maxRows] - Maximum rows
 * @param {React.Ref<HTMLTextAreaElement>} ref - Forwarded ref
 * 
 * @returns {JSX.Element} Textarea component
 * 
 * @example
 * // Basic textarea
 * <Textarea 
 *   label="Comments"
 *   placeholder="Enter your comments..."
 * />
 * 
 * @example
 * // Textarea with character limit
 * <Textarea 
 *   label="Description"
 *   maxLength={500}
 *   showCount
 * />
 * 
 * @example
 * // Auto-resizing textarea
 * <Textarea 
 *   label="Notes"
 *   autoResize
 *   minRows={3}
 *   maxRows={10}
 * />
 * 
 * @example
 * // Textarea with validation
 * <Textarea 
 *   label="Feedback"
 *   error={hasError}
 *   errorMessage="This field is required"
 * />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    variant = 'default',
    size = 'md',
    error = false,
    errorMessage,
    success = false,
    successMessage,
    helperText,
    label,
    required = false,
    showCount = false,
    maxLength,
    autoResize = false,
    minRows = 3,
    maxRows,
    resize = 'vertical',
    className = '',
    startAdornment,
    endAdornment,
    id,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const generatedId = useId();
    const textareaId = id || generatedId;
    
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        
        const scrollHeight = textarea.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
        const minHeight = minRows * lineHeight;
        const maxHeight = maxRows ? maxRows * lineHeight : Infinity;
        
        const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
        textarea.style.height = `${newHeight}px`;
      }
    }, [currentValue, autoResize, minRows, maxRows]);

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      
      onChange?.(event);
    };

    // Handle focus
    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);
      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur?.(event);
    };

    // Component classes
    const textareaClasses = [
      'textarea',
      `textarea--${variant}`,
      `textarea--${size}`,
      error && 'textarea--error',
      success && 'textarea--success',
      focused && 'textarea--focused',
      props.disabled && 'textarea--disabled',
      (startAdornment || endAdornment) && 'textarea--with-adornments',
      className
    ].filter(Boolean).join(' ');

    // Character count
    const characterCount = currentValue ? String(currentValue).length : 0;
    const isOverLimit = maxLength ? characterCount > maxLength : false;

    // Helper text to display
    const getHelperText = () => {
      if (error && errorMessage) return errorMessage;
      if (success && successMessage) return successMessage;
      return helperText;
    };

    return (
      <div className={textareaClasses}>
        {label && (
          <label className="textarea__label" htmlFor={textareaId}>
            {label}
            {required && <span className="textarea__required" aria-label="required">*</span>}
          </label>
        )}
        
        <div className="textarea__wrapper">
          {startAdornment && (
            <div className="textarea__adornment textarea__adornment--start">
              {startAdornment}
            </div>
          )}
          
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            id={textareaId}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="textarea__input"
            style={{
              resize: autoResize ? 'none' : resize,
              minHeight: autoResize ? `${minRows * 1.5}em` : undefined
            }}
            aria-invalid={error}
            aria-describedby={
              [
                getHelperText() && `${textareaId}-helper`,
                showCount && `${textareaId}-count`
              ].filter(Boolean).join(' ') || undefined
            }
            required={required}
            maxLength={maxLength}
            {...props}
          />
          
          {endAdornment && (
            <div className="textarea__adornment textarea__adornment--end">
              {endAdornment}
            </div>
          )}
        </div>
        
        <div className="textarea__footer">
          {getHelperText() && (
            <div
              className={[
                'textarea__helper',
                error && 'textarea__helper--error',
                success && 'textarea__helper--success'
              ].filter(Boolean).join(' ')}
              id={`${textareaId}-helper`}
            >
              {getHelperText()}
            </div>
          )}
          
          {showCount && (
            <div
              className={[
                'textarea__count',
                isOverLimit && 'textarea__count--over-limit'
              ].filter(Boolean).join(' ')}
              id={`${textareaId}-count`}
            >
              {characterCount}{maxLength && `/${maxLength}`}
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Legal-specific textarea variants
export const LegalTextarea = (props: Omit<TextareaProps, 'variant'>) => (
  <Textarea {...props} variant="legal" />
);

export const MinimalTextarea = (props: Omit<TextareaProps, 'variant'>) => (
  <Textarea {...props} variant="minimal" />
);

// Preset textarea variants
export const CommentTextarea = (props: Omit<TextareaProps, 'placeholder' | 'autoResize'>) => (
  <Textarea
    {...props}
    placeholder="Add your comment..."
    autoResize
    minRows={2}
    maxRows={8}
  />
);

export const NotesTextarea = (props: Omit<TextareaProps, 'placeholder' | 'showCount'>) => (
  <Textarea
    {...props}
    placeholder="Enter notes..."
    showCount
    maxLength={500}
  />
);

export const FeedbackTextarea = (props: Omit<TextareaProps, 'placeholder' | 'label' | 'required'>) => (
  <Textarea
    {...props}
    label="Feedback"
    placeholder="Please share your feedback..."
    required
    showCount
    maxLength={1000}
    autoResize
    minRows={4}
    maxRows={10}
  />
);

// Hook for textarea state management
export const useTextarea = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');

  const clear = () => {
    setValue('');
    setError('');
  };

  const validate = (validator: (value: string) => string | null) => {
    const errorMessage = validator(value);
    setError(errorMessage || '');
    return !errorMessage;
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    if (error) setError(''); // Clear error on change
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return {
    value,
    setValue,
    focused,
    setFocused,
    error,
    setError,
    clear,
    validate,
    handlers: {
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur
    }
  };
};

Textarea.displayName = 'Textarea';
