import React, { forwardRef, createContext, useContext } from 'react';
import './Radio.css';

/**
 * RadioProps - Props for individual Radio component
 * 
 * @typedef {Object} RadioProps
 * @extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>
 * @property {string} [label] - Radio button label
 * @property {string} [description] - Additional description
 * @property {string} [error] - Error message
 * @property {('default'|'legal'|'priority')} [variant='default'] - Visual style
 * @property {('sm'|'md'|'lg')} [size='md'] - Size variant
 * @property {boolean} [invalid] - Invalid state
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Radio button label */
  label?: string;
  /** Radio button description */
  description?: string;
  /** Error message */
  error?: string;
  /** Radio button variant */
  variant?: 'default' | 'legal' | 'priority';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the radio is invalid */
  invalid?: boolean;
}

export interface RadioGroupProps {
  /** Radio group name */
  name: string;
  /** Selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Radio group label */
  label?: string;
  /** Radio group description */
  description?: string;
  /** Error message for the group */
  error?: string;
  /** Whether the group is required */
  required?: boolean;
  /** Whether the group is disabled */
  disabled?: boolean;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Children radio buttons */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface RadioOptionProps {
  /** Option value */
  value: string;
  /** Option label */
  label?: string;
  /** Option description */
  description?: string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

// Radio Group Context
interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  return context;
};

// Individual Radio Component
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    className = '', 
    label, 
    description, 
    error, 
    variant = 'default', 
    size = 'md',
    invalid,
    disabled,
    ...props 
  }, ref) => {
    const groupContext = useRadioGroup();
    const isDisabled = disabled || groupContext?.disabled;
    const isInvalid = invalid || !!error;

    const radioClasses = [
      'radio',
      `radio--${variant}`,
      `radio--${size}`,
      isInvalid && 'radio--invalid',
      isDisabled && 'radio--disabled',
      className
    ].filter(Boolean).join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (groupContext?.onChange) {
        groupContext.onChange(e.target.value);
      }
      props.onChange?.(e);
    };

    return (
      <div className={radioClasses}>
        <label className="radio__label">
          <input
            ref={ref}
            type="radio"
            className="radio__input"
            name={groupContext?.name || props.name}
            checked={groupContext ? groupContext.value === props.value : props.checked}
            disabled={isDisabled}
            onChange={handleChange}
            {...props}
          />
          <span className="radio__indicator" />
          {label && (
            <span className="radio__text">
              {label}
              {description && <span className="radio__description">{description}</span>}
            </span>
          )}
        </label>
        {error && <span className="radio__error">{error}</span>}
      </div>
    );
  }
);

// Radio Group Component
export const RadioGroup = ({ 
  name,
  value,
  defaultValue,
  onChange,
  label,
  description,
  error,
  required,
  disabled,
  direction = 'vertical',
  children,
  className = ''
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const groupClasses = [
    'radio-group',
    `radio-group--${direction}`,
    disabled && 'radio-group--disabled',
    error && 'radio-group--invalid',
    className
  ].filter(Boolean).join(' ');

  const contextValue: RadioGroupContextValue = {
    name,
    value: currentValue,
    onChange: handleChange,
    disabled
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={groupClasses} role="radiogroup" aria-labelledby={label ? `${name}-label` : undefined}>
        {label && (
          <label id={`${name}-label`} className="radio-group__label">
            {label}
            {required && <span className="radio-group__required">*</span>}
          </label>
        )}
        {description && <p className="radio-group__description">{description}</p>}
        <div className="radio-group__options">
          {children}
        </div>
        {error && <span className="radio-group__error">{error}</span>}
      </div>
    </RadioGroupContext.Provider>
  );
};

// Radio Option Component (for convenient use with RadioGroup)
export const RadioOption = ({ 
  value, 
  label, 
  description, 
  disabled, 
  className = '',
  children
}: RadioOptionProps) => {
  return (
    <Radio
      value={value}
      label={label}
      description={description}
      disabled={disabled}
      className={className}
    >
      {children}
    </Radio>
  );
};

// Legal-specific radio variants
export const LegalRadioGroup = (props: Omit<RadioGroupProps, 'name'> & { name: string }) => (
  <RadioGroup {...props} />
);

export const PriorityRadio = (props: Omit<RadioProps, 'variant'>) => (
  <Radio {...props} variant="priority" />
);

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';
RadioOption.displayName = 'RadioOption';
