import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export interface TooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  /** Tooltip trigger */
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  /** Whether tooltip is visible (for manual trigger) */
  visible?: boolean;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Tooltip variant */
  variant?: 'default' | 'dark' | 'light' | 'legal' | 'warning' | 'error';
  /** Maximum width of tooltip */
  maxWidth?: number;
  /** Whether to show arrow */
  arrow?: boolean;
  /** Custom class name */
  className?: string;
  /** Children element that triggers the tooltip */
  children: React.ReactElement;
  /** Callback when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({
    content,
    placement = 'top',
    trigger = 'hover',
    visible,
    disabled = false,
    delay = 200,
    variant = 'default',
    maxWidth = 250,
    arrow = true,
    className = '',
    children,
    onVisibilityChange
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const portalRoot = useRef<HTMLDivElement | null>(null);

    // Control visibility
    const actuallyVisible = trigger === 'manual' ? (visible ?? false) : isVisible;

    // Create portal root on mount
    useEffect(() => {
      portalRoot.current = document.createElement('div');
      portalRoot.current.className = 'tooltip-portal';
      document.body.appendChild(portalRoot.current);

      return () => {
        if (portalRoot.current) {
          document.body.removeChild(portalRoot.current);
        }
      };
    }, []);

    // Calculate tooltip position
    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let x = 0;
      let y = 0;
      const offset = 8; // Distance from trigger element

      // Calculate position based on placement
      switch (placement) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - offset;
          break;
        case 'top-start':
          x = triggerRect.left;
          y = triggerRect.top - tooltipRect.height - offset;
          break;
        case 'top-end':
          x = triggerRect.right - tooltipRect.width;
          y = triggerRect.top - tooltipRect.height - offset;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + offset;
          break;
        case 'bottom-start':
          x = triggerRect.left;
          y = triggerRect.bottom + offset;
          break;
        case 'bottom-end':
          x = triggerRect.right - tooltipRect.width;
          y = triggerRect.bottom + offset;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'left-start':
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.top;
          break;
        case 'left-end':
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.bottom - tooltipRect.height;
          break;
        case 'right':
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right-start':
          x = triggerRect.right + offset;
          y = triggerRect.top;
          break;
        case 'right-end':
          x = triggerRect.right + offset;
          y = triggerRect.bottom - tooltipRect.height;
          break;
      }

      // Add scroll offset
      x += scrollX;
      y += scrollY;

      // Keep tooltip within viewport
      x = Math.max(8, Math.min(x, viewportWidth - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, viewportHeight - tooltipRect.height - 8));

      setPosition({ x, y });
    };

    // Show tooltip
    const showTooltip = () => {
      if (disabled) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        onVisibilityChange?.(true);
      }, delay);
    };

    // Hide tooltip
    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsVisible(false);
      onVisibilityChange?.(false);
    };

    // Toggle tooltip
    const toggleTooltip = () => {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    };

    // Update position when visible
    useEffect(() => {
      if (actuallyVisible) {
        updatePosition();
        
        const handleResize = () => updatePosition();
        const handleScroll = () => updatePosition();
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll, true);
        };
      }
    }, [actuallyVisible, placement]);

    // Clean up timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Event handlers based on trigger
    const getEventHandlers = () => {
      if (disabled || trigger === 'manual') return {};

      switch (trigger) {
        case 'hover':
          return {
            onMouseEnter: showTooltip,
            onMouseLeave: hideTooltip,
            onFocus: showTooltip,
            onBlur: hideTooltip
          };
        case 'click':
          return {
            onClick: toggleTooltip
          };
        case 'focus':
          return {
            onFocus: showTooltip,
            onBlur: hideTooltip
          };
        default:
          return {};
      }
    };

    // Clone children with event handlers and ref
    const eventHandlers = getEventHandlers();
    const triggerElement = React.cloneElement(children, {
      ...eventHandlers,
      ref: (node: HTMLElement) => {
        triggerRef.current = node;
        
        // Handle existing ref on children
        const childRef = (children as any).ref;
        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef?.current !== undefined) {
          childRef.current = node;
        }
      }
    } as any);

    // Tooltip classes
    const tooltipClasses = [
      'tooltip',
      `tooltip--${variant}`,
      `tooltip--${placement}`,
      arrow && 'tooltip--arrow',
      className
    ].filter(Boolean).join(' ');

    // Tooltip content
    const tooltipElement = (
      <div
        ref={(node) => {
          tooltipRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref?.current !== undefined) {
            ref.current = node;
          }
        }}
        className={tooltipClasses}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          maxWidth: maxWidth,
          visibility: actuallyVisible ? 'visible' : 'hidden',
          opacity: actuallyVisible ? 1 : 0,
          pointerEvents: actuallyVisible ? 'auto' : 'none',
          zIndex: 9999
        }}
        role="tooltip"
        aria-hidden={!actuallyVisible}
      >
        <div className="tooltip__content">
          {content}
        </div>
        {arrow && <div className="tooltip__arrow" />}
      </div>
    );

    return (
      <>
        {triggerElement}
        {portalRoot.current && createPortal(tooltipElement, portalRoot.current)}
      </>
    );
  }
);

// Legal-specific tooltip variants
export const LegalTooltip = (props: Omit<TooltipProps, 'variant'>) => (
  <Tooltip {...props} variant="legal" />
);

export const WarningTooltip = (props: Omit<TooltipProps, 'variant'>) => (
  <Tooltip {...props} variant="warning" />
);

export const ErrorTooltip = (props: Omit<TooltipProps, 'variant'>) => (
  <Tooltip {...props} variant="error" />
);

Tooltip.displayName = 'Tooltip';
