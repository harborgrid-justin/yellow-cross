import React, { forwardRef, useState } from 'react';
import './Alert.css';

/**
 * AlertType - Alert severity types
 * 
 * @typedef {('info'|'success'|'warning'|'error')} AlertType
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * AlertProps - Props for the Alert component
 * 
 * @typedef {Object} AlertProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 * @property {AlertType} [type='info'] - Alert severity type
 * @property {string} [title] - Alert title
 * @property {string} [description] - Alert description text
 * @property {boolean} [dismissible=false] - Allow user to dismiss
 * @property {Function} [onDismiss] - Callback when dismissed
 * @property {React.ReactNode} [icon] - Custom icon element
 * @property {React.ReactNode} [actions] - Action buttons
 * @property {React.ReactNode} [children] - Custom content
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Alert - Notification banner for user feedback
 * 
 * A styled notification component for displaying important messages,
 * status updates, or feedback to users. Supports multiple severity
 * levels with appropriate colors and icons.
 * 
 * Features:
 * - Four severity types (info, success, warning, error)
 * - Optional title and description
 * - Dismissible with close button
 * - Custom icon support
 * - Action buttons area
 * - Automatic visibility management
 * - Forward ref support
 * 
 * @component
 * @param {AlertProps} props - Component props
 * @param {AlertType} [props.type='info'] - Severity level
 * @param {string} [props.title] - Main alert heading
 * @param {string} [props.description] - Detailed message
 * @param {boolean} [props.dismissible=false] - Show dismiss button
 * @param {Function} [props.onDismiss] - Called when alert is dismissed
 * @param {React.ReactNode} [props.icon] - Custom icon (overrides default)
 * @param {React.ReactNode} [props.actions] - Action buttons or links
 * @param {React.ReactNode} [props.children] - Custom content (overrides title/description)
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * 
 * @returns {JSX.Element|null} Alert component or null if dismissed
 * 
 * @example
 * // Success alert
 * <Alert type="success" title="Saved successfully" />
 * 
 * @example
 * // Error alert with description
 * <Alert 
 *   type="error"
 *   title="Failed to save"
 *   description="Please check your internet connection and try again."
 * />
 * 
 * @example
 * // Dismissible warning with actions
 * <Alert 
 *   type="warning"
 *   title="Action required"
 *   dismissible
 *   onDismiss={() => console.log('Dismissed')}
 *   actions={
 *     <Button variant="ghost" size="sm">
 *       Review Now
 *     </Button>
 *   }
 * >
 *   Your trial expires in 3 days.
 * </Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      description,
      dismissible = false,
      onDismiss,
      icon,
      actions,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(true);

    const handleDismiss = () => {
      setVisible(false);
      onDismiss?.();
    };

    if (!visible) {
      return null;
    }

    const classes = [
      'alert',
      `alert--${type}`,
      dismissible && 'alert--dismissible',
      className
    ].filter(Boolean).join(' ');

    const defaultIcons = {
      info: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      ),
      success: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      ),
      warning: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      error: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )
    };

    return (
      <div ref={ref} className={classes} role="alert" {...props}>
        <div className="alert__content">
          <div className="alert__icon-wrapper">
            {icon || defaultIcons[type]}
          </div>
          
          <div className="alert__body">
            {title && <div className="alert__title">{title}</div>}
            {description && <div className="alert__description">{description}</div>}
            {children && <div className="alert__children">{children}</div>}
            {actions && <div className="alert__actions">{actions}</div>}
          </div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            className="alert__dismiss"
            onClick={handleDismiss}
            aria-label="Dismiss alert"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

// Legal-specific alert variants
export interface LegalAlertProps extends Omit<AlertProps, 'type'> {
  alertType: 'deadline' | 'conflict' | 'privilege' | 'compliance' | 'billing' | 'document';
}

export const LegalAlert = forwardRef<HTMLDivElement, LegalAlertProps>(
  ({ alertType, ...props }, ref) => {
    const legalTypeMap: Record<LegalAlertProps['alertType'], AlertType> = {
      deadline: 'warning',
      conflict: 'error',
      privilege: 'warning',
      compliance: 'error',
      billing: 'info',
      document: 'info'
    };

    const legalIcons = {
      deadline: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      conflict: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      privilege: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <circle cx="12" cy="5" r="2"/>
          <path d="m12 7-8.5 4.5a2 2 0 0 0 0 3L12 19l8.5-4.5a2 2 0 0 0 0-3L12 7Z"/>
        </svg>
      ),
      compliance: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      billing: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
      document: (
        <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      )
    };

    return (
      <Alert
        ref={ref}
        type={legalTypeMap[alertType]}
        icon={legalIcons[alertType]}
        {...props}
      />
    );
  }
);

LegalAlert.displayName = 'LegalAlert';

// Toast Alert Component (for temporary notifications)
export interface ToastAlertProps extends AlertProps {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export const ToastAlert = forwardRef<HTMLDivElement, ToastAlertProps>(
  (
    {
      duration = 5000,
      position = 'top-right',
      onDismiss,
      className = '',
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    const classes = [
      'toast-alert',
      `toast-alert--${position}`,
      className
    ].filter(Boolean).join(' ');

    return (
      <Alert
        ref={ref}
        className={classes}
        dismissible={true}
        onDismiss={onDismiss}
        {...props}
      />
    );
  }
);

ToastAlert.displayName = 'ToastAlert';
