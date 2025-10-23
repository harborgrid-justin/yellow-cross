import React, { forwardRef, useState, useId } from 'react';
import './Switch.css';

/**
 * SwitchProps - Props for the Switch component
 * 
 * @typedef {Object} SwitchProps
 * @extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>
 * @property {boolean} [checked] - Controlled checked state
 * @property {boolean} [defaultChecked] - Default checked state
 * @property {boolean} [disabled=false] - Disabled state
 * @property {('default'|'legal'|'minimal'|'ios')} [variant='default'] - Visual style
 * @property {('sm'|'md'|'lg')} [size='md'] - Size variant
 * @property {('primary'|'success'|'warning'|'danger'|'info')} [color='primary'] - Color theme
 * @property {React.ReactNode} [label] - Label text
 * @property {React.ReactNode} [description] - Description text
 * @property {('left'|'right')} [labelPosition='right'] - Label position
 * @property {boolean} [loading=false] - Loading state
 * @property {Function} onChange - Change handler
 * @property {React.ReactNode} [checkedIcon] - Custom checked icon
 * @property {React.ReactNode} [uncheckedIcon] - Custom unchecked icon
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** Whether switch is checked */
  checked?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
  /** Whether switch is disabled */
  disabled?: boolean;
  /** Switch variant */
  variant?: 'default' | 'legal' | 'minimal' | 'ios';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Label text */
  label?: React.ReactNode;
  /** Description text */
  description?: React.ReactNode;
  /** Label position */
  labelPosition?: 'left' | 'right';
  /** Whether to show loading state */
  loading?: boolean;
  /** Custom class name */
  className?: string;
  /** Change handler */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Custom icons */
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

/**
 * Switch - Toggle switch component with multiple variants
 * 
 * A customizable switch/toggle component for boolean input with support
 * for labels, descriptions, loading states, and custom icons.
 * 
 * Features:
 * - Four visual variants (default, legal, minimal, ios)
 * - Three size options (sm, md, lg)
 * - Five color themes
 * - Optional label and description
 * - Loading state support
 * - Custom icons for checked/unchecked states
 * - Controlled and uncontrolled modes
 * - Forward ref support
 * 
 * @component
 * @param {SwitchProps} props - Component props
 * @param {boolean} [props.checked] - Controlled state
 * @param {boolean} [props.defaultChecked] - Initial state
 * @param {string} [props.variant='default'] - Visual style
 * @param {string} [props.size='md'] - Size variant
 * @param {string} [props.color='primary'] - Color theme
 * @param {React.ReactNode} [props.label] - Label content
 * @param {Function} props.onChange - Change callback
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref
 * 
 * @returns {JSX.Element} Switch component
 * 
 * @example
 * // Basic switch
 * <Switch label="Enable notifications" />
 * 
 * @example
 * // Controlled switch
 * <Switch 
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Dark mode"
 * />
 * 
 * @example
 * // Switch with description
 * <Switch 
 *   label="Email alerts"
 *   description="Receive email notifications for important updates"
 * />
 * 
 * @example
 * // Loading switch
 * <Switch 
 *   label="Syncing..."
 *   loading={isSyncing}
 *   disabled
 * />
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({
    checked,
    defaultChecked,
    disabled = false,
    variant = 'default',
    size = 'md',
    color = 'primary',
    label,
    description,
    labelPosition = 'right',
    loading = false,
    className = '',
    onChange,
    checkedIcon,
    uncheckedIcon,
    id,
    ...props
  }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const generatedId = useId();
    const switchId = id || generatedId;
    
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      
      onChange?.(newChecked, event);
    };

    // Component classes
    const switchClasses = [
      'switch',
      `switch--${variant}`,
      `switch--${size}`,
      `switch--${color}`,
      isChecked && 'switch--checked',
      disabled && 'switch--disabled',
      loading && 'switch--loading',
      labelPosition === 'left' && 'switch--label-left',
      className
    ].filter(Boolean).join(' ');

    const renderSwitch = () => (
      <label className="switch__wrapper" htmlFor={switchId}>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={isChecked}
          disabled={disabled || loading}
          onChange={handleChange}
          className="switch__input"
          role="switch"
          aria-checked={isChecked}
          aria-describedby={description ? `${switchId}-description` : undefined}
          {...props}
        />
        <span className="switch__track">
          <span className="switch__thumb">
            {loading && (
              <span className="switch__spinner" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </span>
            )}
            {!loading && isChecked && checkedIcon && (
              <span className="switch__icon switch__icon--checked" aria-hidden="true">
                {checkedIcon}
              </span>
            )}
            {!loading && !isChecked && uncheckedIcon && (
              <span className="switch__icon switch__icon--unchecked" aria-hidden="true">
                {uncheckedIcon}
              </span>
            )}
          </span>
        </span>
      </label>
    );

    const renderLabel = () => {
      if (!label && !description) return null;
      
      return (
        <div className="switch__label-wrapper">
          {label && (
            <span className="switch__label">
              {label}
            </span>
          )}
          {description && (
            <span className="switch__description" id={`${switchId}-description`}>
              {description}
            </span>
          )}
        </div>
      );
    };

    return (
      <div className={switchClasses}>
        {labelPosition === 'left' && renderLabel()}
        {renderSwitch()}
        {labelPosition === 'right' && renderLabel()}
      </div>
    );
  }
);

// Legal-specific switch variants
export const LegalSwitch = (props: Omit<SwitchProps, 'variant'>) => (
  <Switch {...props} variant="legal" />
);

export const MinimalSwitch = (props: Omit<SwitchProps, 'variant'>) => (
  <Switch {...props} variant="minimal" />
);

export const IOSSwitch = (props: Omit<SwitchProps, 'variant'>) => (
  <Switch {...props} variant="ios" />
);

// Preset switch variants with common icons
export const ToggleSwitch = (props: Omit<SwitchProps, 'checkedIcon' | 'uncheckedIcon'>) => (
  <Switch 
    {...props} 
    checkedIcon={
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20,6 9,17 4,12" />
      </svg>
    }
  />
);

export const OnOffSwitch = (props: Omit<SwitchProps, 'checkedIcon' | 'uncheckedIcon'>) => (
  <Switch 
    {...props} 
    checkedIcon={<span style={{ fontSize: '10px', fontWeight: 'bold' }}>ON</span>}
    uncheckedIcon={<span style={{ fontSize: '10px', fontWeight: 'bold' }}>OFF</span>}
  />
);

export const YesNoSwitch = (props: Omit<SwitchProps, 'checkedIcon' | 'uncheckedIcon'>) => (
  <Switch 
    {...props} 
    checkedIcon={<span style={{ fontSize: '10px', fontWeight: 'bold' }}>YES</span>}
    uncheckedIcon={<span style={{ fontSize: '10px', fontWeight: 'bold' }}>NO</span>}
  />
);

// Hook for switch state management
export const useSwitch = (initialChecked = false) => {
  const [checked, setChecked] = useState(initialChecked);

  const toggle = () => {
    setChecked(prev => !prev);
  };

  const turnOn = () => {
    setChecked(true);
  };

  const turnOff = () => {
    setChecked(false);
  };

  return {
    checked,
    setChecked,
    toggle,
    turnOn,
    turnOff
  };
};

Switch.displayName = 'Switch';
