import React, { forwardRef, createContext, useContext, useState, useRef } from 'react';
import './Accordion.css';

export interface AccordionItem {
  /** Accordion item identifier */
  id: string;
  /** Header content */
  header: React.ReactNode;
  /** Panel content */
  content: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether item starts expanded */
  defaultExpanded?: boolean;
  /** Custom header icon */
  icon?: React.ReactNode;
}

export interface AccordionProps {
  /** Accordion items */
  items?: AccordionItem[];
  /** Accordion variant */
  variant?: 'default' | 'bordered' | 'filled' | 'legal' | 'minimal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether multiple items can be open */
  multiple?: boolean;
  /** Whether accordion is collapsible (all items can be closed) */
  collapsible?: boolean;
  /** Default expanded item IDs */
  defaultExpanded?: string[];
  /** Controlled expanded item IDs */
  expanded?: string[];
  /** Custom class name */
  className?: string;
  /** Expansion change handler */
  onExpandedChange?: (expanded: string[]) => void;
  /** Custom header renderer */
  renderHeader?: (item: AccordionItem, isExpanded: boolean) => React.ReactNode;
  /** Custom content renderer */
  renderContent?: (item: AccordionItem) => React.ReactNode;
  /** Children for compound component usage */
  children?: React.ReactNode;
}

export interface AccordionItemProps {
  /** Item identifier */
  id: string;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

export interface AccordionHeaderProps {
  /** Associated item ID */
  itemId: string;
  /** Custom class name */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

export interface AccordionPanelProps {
  /** Associated item ID */
  itemId: string;
  /** Custom class name */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

// Accordion Context
interface AccordionContextValue {
  expanded: string[];
  toggleItem: (itemId: string) => void;
  variant: string;
  size: string;
  multiple: boolean;
  disabled?: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion compound components must be used within Accordion component');
  }
  return context;
};

// Main Accordion Component
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({
    items = [],
    variant = 'default',
    size = 'md',
    multiple = true,
    collapsible = true,
    defaultExpanded = [],
    expanded,
    className = '',
    onExpandedChange,
    renderHeader,
    renderContent,
    children,
    ...props
  }, ref) => {
    const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
      if (defaultExpanded.length > 0) return defaultExpanded;
      if (items.length > 0 && !multiple && !collapsible) return [items[0].id];
      return [];
    });

    const currentExpanded = expanded !== undefined ? expanded : internalExpanded;

    // Handle item toggle
    const toggleItem = (itemId: string) => {
      let newExpanded: string[];

      if (multiple) {
        if (currentExpanded.includes(itemId)) {
          newExpanded = currentExpanded.filter(id => id !== itemId);
        } else {
          newExpanded = [...currentExpanded, itemId];
        }
      } else {
        if (currentExpanded.includes(itemId)) {
          newExpanded = collapsible ? [] : currentExpanded;
        } else {
          newExpanded = [itemId];
        }
      }

      if (expanded === undefined) {
        setInternalExpanded(newExpanded);
      }
      onExpandedChange?.(newExpanded);
    };

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
      const itemElements = items.filter(item => !item.disabled);
      const currentIndex = itemElements.findIndex(item => item.id === itemId);
      
      let nextIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : itemElements.length - 1;
          break;
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = currentIndex < itemElements.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = itemElements.length - 1;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          toggleItem(itemId);
          return;
        default:
          return;
      }
      
      const nextItem = itemElements[nextIndex];
      if (nextItem) {
        // Focus the next accordion header
        setTimeout(() => {
          const accordionElement = document.querySelector(`[data-accordion-item="${nextItem.id}"] .accordion__header`) as HTMLElement;
          accordionElement?.focus();
        }, 0);
      }
    };

    // Component classes
    const accordionClasses = [
      'accordion',
      `accordion--${variant}`,
      `accordion--${size}`,
      className
    ].filter(Boolean).join(' ');

    const contextValue: AccordionContextValue = {
      expanded: currentExpanded,
      toggleItem,
      variant,
      size,
      multiple
    };

    // Render accordion item
    const renderAccordionItem = (item: AccordionItem) => {
      const isExpanded = currentExpanded.includes(item.id);
      
      return (
        <div
          key={item.id}
          data-accordion-item={item.id}
          className={[
            'accordion__item',
            isExpanded && 'accordion__item--expanded',
            item.disabled && 'accordion__item--disabled'
          ].filter(Boolean).join(' ')}
        >
          <button
            className="accordion__header"
            onClick={() => !item.disabled && toggleItem(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            disabled={item.disabled}
            aria-expanded={isExpanded}
            aria-controls={`accordion-panel-${item.id}`}
            id={`accordion-header-${item.id}`}
          >
            <span className="accordion__header-content">
              {item.icon && <span className="accordion__header-icon">{item.icon}</span>}
              {renderHeader ? renderHeader(item, isExpanded) : item.header}
            </span>
            <span className="accordion__header-indicator" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </span>
          </button>
          <div
            className="accordion__panel"
            role="region"
            aria-labelledby={`accordion-header-${item.id}`}
            id={`accordion-panel-${item.id}`}
            hidden={!isExpanded}
          >
            <div className="accordion__panel-content">
              {renderContent ? renderContent(item) : item.content}
            </div>
          </div>
        </div>
      );
    };

    // If using compound components
    if (children) {
      return (
        <AccordionContext.Provider value={contextValue}>
          <div ref={ref} className={accordionClasses} {...props}>
            {children}
          </div>
        </AccordionContext.Provider>
      );
    }

    // Standard usage with items prop
    return (
      <div ref={ref} className={accordionClasses} {...props}>
        {items.map(renderAccordionItem)}
      </div>
    );
  }
);

// Accordion Item Component (for compound usage)
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ id, disabled = false, className = '', children, ...props }, ref) => {
    const { expanded } = useAccordionContext();
    const isExpanded = expanded.includes(id);

    const itemClasses = [
      'accordion__item',
      isExpanded && 'accordion__item--expanded',
      disabled && 'accordion__item--disabled',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        data-accordion-item={id}
        className={itemClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Accordion Header Component (for compound usage)
export const AccordionHeader = forwardRef<HTMLButtonElement, AccordionHeaderProps>(
  ({ itemId, className = '', children, ...props }, ref) => {
    const { expanded, toggleItem } = useAccordionContext();
    const isExpanded = expanded.includes(itemId);

    const headerClasses = [
      'accordion__header',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={headerClasses}
        onClick={() => toggleItem(itemId)}
        aria-expanded={isExpanded}
        aria-controls={`accordion-panel-${itemId}`}
        id={`accordion-header-${itemId}`}
        {...props}
      >
        <span className="accordion__header-content">{children}</span>
        <span className="accordion__header-indicator" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </span>
      </button>
    );
  }
);

// Accordion Panel Component (for compound usage)
export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ itemId, className = '', children, ...props }, ref) => {
    const { expanded } = useAccordionContext();
    const isExpanded = expanded.includes(itemId);

    const panelClasses = [
      'accordion__panel',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={panelClasses}
        role="region"
        aria-labelledby={`accordion-header-${itemId}`}
        id={`accordion-panel-${itemId}`}
        hidden={!isExpanded}
        {...props}
      >
        <div className="accordion__panel-content">
          {children}
        </div>
      </div>
    );
  }
);

// Legal-specific accordion variants
export const LegalAccordion = (props: Omit<AccordionProps, 'variant'>) => (
  <Accordion {...props} variant="legal" />
);

export const MinimalAccordion = (props: Omit<AccordionProps, 'variant'>) => (
  <Accordion {...props} variant="minimal" />
);

// Hook for accordion state management
export const useAccordion = (initialExpanded: string[] = [], multiple = true) => {
  const [expanded, setExpanded] = useState<string[]>(initialExpanded);

  const expandItem = (itemId: string) => {
    if (multiple) {
      setExpanded(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
    } else {
      setExpanded([itemId]);
    }
  };

  const collapseItem = (itemId: string) => {
    setExpanded(prev => prev.filter(id => id !== itemId));
  };

  const toggleItem = (itemId: string) => {
    if (expanded.includes(itemId)) {
      collapseItem(itemId);
    } else {
      expandItem(itemId);
    }
  };

  const expandAll = (itemIds: string[]) => {
    if (multiple) {
      setExpanded(itemIds);
    } else if (itemIds.length > 0) {
      setExpanded([itemIds[0]]);
    }
  };

  const collapseAll = () => {
    setExpanded([]);
  };

  return {
    expanded,
    setExpanded,
    expandItem,
    collapseItem,
    toggleItem,
    expandAll,
    collapseAll
  };
};

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionHeader.displayName = 'AccordionHeader';
AccordionPanel.displayName = 'AccordionPanel';
