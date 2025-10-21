import React, { forwardRef, createContext, useContext } from 'react';
import './Form.css';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  layout?: 'vertical' | 'horizontal' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

interface FormContextValue {
  layout: 'vertical' | 'horizontal' | 'inline';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
}

const FormContext = createContext<FormContextValue>({
  layout: 'vertical',
  size: 'md',
  disabled: false,
});

export const useFormContext = () => useContext(FormContext);

export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      layout = 'vertical',
      size = 'md',
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'form',
      `form--${layout}`,
      `form--${size}`,
      disabled && 'form--disabled',
      className
    ].filter(Boolean).join(' ');

    return (
      <FormContext.Provider value={{ layout, size, disabled }}>
        <form
          ref={ref}
          className={classes}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

Form.displayName = 'Form';

// Form Item Component
export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  (
    {
      label,
      htmlFor,
      required = false,
      error,
      helperText,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const { layout, size } = useFormContext();
    const itemId = htmlFor || `form-item-${Math.random().toString(36).substr(2, 9)}`;

    const classes = [
      'form-item',
      `form-item--${layout}`,
      `form-item--${size}`,
      error && 'form-item--error',
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {label && (
          <label htmlFor={itemId} className="form-item__label">
            {label}
            {required && <span className="form-item__required">*</span>}
          </label>
        )}
        
        <div className="form-item__control">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              const childProps = child.props as any;
              return React.cloneElement(child, {
                id: childProps.id || itemId,
                'aria-invalid': !!error,
                'aria-describedby': error ? `${itemId}-error` : helperText ? `${itemId}-helper` : undefined,
                ...childProps
              });
            }
            return child;
          })}
        </div>
        
        {error && (
          <div id={`${itemId}-error`} className="form-item__error" role="alert">
            <svg className="form-item__error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${itemId}-helper`} className="form-item__helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

FormItem.displayName = 'FormItem';

// Form Actions Component
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
  children: React.ReactNode;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  (
    {
      align = 'right',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const { layout, size } = useFormContext();
    
    const classes = [
      'form-actions',
      `form-actions--${layout}`,
      `form-actions--${size}`,
      `form-actions--${align}`,
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

FormActions.displayName = 'FormActions';
