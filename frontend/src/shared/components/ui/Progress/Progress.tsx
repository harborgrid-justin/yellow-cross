import React, { forwardRef } from 'react';
import './Progress.css';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      showLabel = false,
      label,
      showPercentage = false,
      indeterminate = false,
      striped = false,
      animated = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);
    
    const classes = [
      'progress',
      `progress--${size}`,
      `progress--${variant}`,
      indeterminate && 'progress--indeterminate',
      striped && 'progress--striped',
      animated && 'progress--animated',
      className
    ].filter(Boolean).join(' ');

    const displayLabel = label || (showPercentage ? `${Math.round(percentage)}%` : '');

    return (
      <div ref={ref} className={classes} {...props}>
        {(showLabel || showPercentage || label) && (
          <div className="progress__label">
            <span className="progress__label-text">{displayLabel}</span>
            {showPercentage && !label && (
              <span className="progress__percentage">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        
        <div className="progress__track" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
          <div 
            className="progress__fill"
            style={{ width: indeterminate ? '30%' : `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Circular Progress Component
export interface CircularProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  indeterminate?: boolean;
}

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 120,
      strokeWidth = 8,
      variant = 'default',
      showLabel = false,
      label,
      showPercentage = false,
      indeterminate = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = indeterminate ? 0 : circumference - (percentage / 100) * circumference;
    
    const classes = [
      'circular-progress',
      `circular-progress--${variant}`,
      indeterminate && 'circular-progress--indeterminate',
      className
    ].filter(Boolean).join(' ');

    const displayLabel = label || (showPercentage ? `${Math.round(percentage)}%` : '');

    return (
      <div ref={ref} className={classes} style={{ width: size, height: size }} {...props}>
        <svg className="circular-progress__svg" width={size} height={size}>
          <circle
            className="circular-progress__track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            className="circular-progress__fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemax={max}
          />
        </svg>
        
        {(showLabel || showPercentage || label) && (
          <div className="circular-progress__label">
            {displayLabel}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

// Step Progress Component for Legal Workflows
export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
    status: 'pending' | 'current' | 'completed' | 'error';
  }>;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export const StepProgress = forwardRef<HTMLDivElement, StepProgressProps>(
  (
    {
      steps,
      orientation = 'horizontal',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const classes = [
      'step-progress',
      `step-progress--${orientation}`,
      `step-progress--${size}`,
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="step-progress__step">
              <div className="step-progress__step-content">
                <div className={`step-progress__indicator step-progress__indicator--${step.status}`}>
                  {step.status === 'completed' ? (
                    <svg className="step-progress__check" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  ) : step.status === 'error' ? (
                    <svg className="step-progress__error" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  ) : (
                    <span className="step-progress__number">{index + 1}</span>
                  )}
                </div>
                
                <div className="step-progress__info">
                  <div className="step-progress__label">{step.label}</div>
                  {step.description && (
                    <div className="step-progress__description">{step.description}</div>
                  )}
                </div>
              </div>
              
              {!isLast && (
                <div className={`step-progress__connector step-progress__connector--${
                  step.status === 'completed' ? 'completed' : 'pending'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

StepProgress.displayName = 'StepProgress';
