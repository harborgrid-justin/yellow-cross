import React, { forwardRef } from 'react';
import './Badge.css';

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      pulse = false,
      removable = false,
      onRemove,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'badge',
      `badge--${variant}`,
      `badge--${size}`,
      dot && 'badge--dot',
      pulse && 'badge--pulse',
      removable && 'badge--removable',
      className
    ].filter(Boolean).join(' ');

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <span ref={ref} className={classes} {...props}>
        {dot && <span className="badge__dot" />}
        <span className="badge__content">{children}</span>
        {removable && (
          <button
            type="button"
            className="badge__remove"
            onClick={handleRemove}
            aria-label="Remove badge"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge Component for legal status indicators
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'urgent' | 'overdue';
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusVariantMap: Record<StatusBadgeProps['status'], BadgeVariant> = {
      active: 'success',
      inactive: 'secondary',
      pending: 'warning',
      completed: 'success',
      cancelled: 'error',
      draft: 'secondary',
      urgent: 'error',
      overdue: 'error'
    };

    const statusLabels: Record<StatusBadgeProps['status'], string> = {
      active: 'Active',
      inactive: 'Inactive', 
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      draft: 'Draft',
      urgent: 'Urgent',
      overdue: 'Overdue'
    };

    return (
      <Badge
        ref={ref}
        variant={statusVariantMap[status]}
        {...props}
      >
        {statusLabels[status]}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Priority Badge Component for legal case priorities
export interface PriorityBadgeProps extends Omit<BadgeProps, 'variant'> {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const PriorityBadge = forwardRef<HTMLSpanElement, PriorityBadgeProps>(
  ({ priority, ...props }, ref) => {
    const priorityVariantMap: Record<PriorityBadgeProps['priority'], BadgeVariant> = {
      low: 'secondary',
      medium: 'info',
      high: 'warning',
      critical: 'error'
    };

    const priorityLabels: Record<PriorityBadgeProps['priority'], string> = {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority',
      critical: 'Critical'
    };

    return (
      <Badge
        ref={ref}
        variant={priorityVariantMap[priority]}
        pulse={priority === 'critical'}
        {...props}
      >
        {priorityLabels[priority]}
      </Badge>
    );
  }
);

PriorityBadge.displayName = 'PriorityBadge';

// Notification Badge Component
export interface NotificationBadgeProps extends Omit<BadgeProps, 'children'> {
  count?: number;
  max?: number;
  showZero?: boolean;
}

export const NotificationBadge = forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  (
    {
      count = 0,
      max = 99,
      showZero = false,
      dot = false,
      ...props
    },
    ref
  ) => {
    if (!showZero && count === 0 && !dot) {
      return null;
    }

    const displayCount = count > max ? `${max}+` : count.toString();

    return (
      <Badge
        ref={ref}
        variant="error"
        size="sm"
        dot={dot || count === 0}
        {...props}
      >
        {!dot && count > 0 ? displayCount : ''}
      </Badge>
    );
  }
);

NotificationBadge.displayName = 'NotificationBadge';
