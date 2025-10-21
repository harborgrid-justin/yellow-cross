import React, { forwardRef } from 'react';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  /** Item label */
  label: string;
  /** Item href (for links) */
  href?: string;
  /** Item icon */
  icon?: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Custom data */
  data?: any;
}

export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Custom separator */
  separator?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Breadcrumb variant */
  variant?: 'default' | 'legal' | 'minimal' | 'pills';
  /** Maximum number of items to show */
  maxItems?: number;
  /** Whether to show icons */
  showIcons?: boolean;
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean;
  /** Custom class name */
  className?: string;
  /** Item click handler */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  /** Custom item renderer */
  renderItem?: (item: BreadcrumbItem, index: number, isLast: boolean) => React.ReactNode;
  /** Custom separator renderer */
  renderSeparator?: (index: number) => React.ReactNode;
}

const DefaultSeparator = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="breadcrumb__separator-icon">
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="breadcrumb__home-icon">
    <path
      d="M2 6L8 1L14 6V14C14 14.2652 13.8946 14.5196 13.7071 14.7071C13.5196 14.8946 13.2652 15 13 15H3C2.73478 15 2.48043 14.8946 2.29289 14.7071C2.10536 14.5196 2 14.2652 2 14V6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 15V9H10V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({
    items,
    separator,
    size = 'md',
    variant = 'default',
    maxItems,
    showIcons = true,
    showHomeIcon = false,
    className = '',
    onItemClick,
    renderItem,
    renderSeparator,
    ...props
  }, ref) => {
    // Process items based on maxItems
    const processedItems = React.useMemo(() => {
      if (!maxItems || items.length <= maxItems) {
        return items;
      }

      const firstItem = items[0];
      const lastItems = items.slice(-maxItems + 2);
      const collapsedItem: BreadcrumbItem = {
        label: '...',
        disabled: true,
        data: { collapsed: true, hiddenItems: items.slice(1, -maxItems + 2) }
      };

      return [firstItem, collapsedItem, ...lastItems];
    }, [items, maxItems]);

    // Handle item click
    const handleItemClick = (item: BreadcrumbItem, index: number, event: React.MouseEvent) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }

      // Find original index if items were collapsed
      let originalIndex = index;
      if (maxItems && items.length > maxItems && index > 0) {
        const collapsedCount = items.length - maxItems + 1;
        if (index === 1) {
          // This is the collapsed item
          originalIndex = -1; // Invalid index for collapsed items
        } else if (index > 1) {
          originalIndex = index + collapsedCount - 1;
        }
      }

      onItemClick?.(item, originalIndex);
    };

    // Render separator
    const renderSep = (index: number) => {
      if (renderSeparator) {
        return renderSeparator(index);
      }

      return (
        <span className="breadcrumb__separator" aria-hidden="true">
          {separator || <DefaultSeparator />}
        </span>
      );
    };

    // Render breadcrumb item
    const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
      if (renderItem) {
        return renderItem(item, index, isLast);
      }

      const isCollapsed = item.data?.collapsed;
      const isFirst = index === 0;
      const hasIcon = showIcons && (item.icon || (showHomeIcon && isFirst));

      const itemContent = (
        <>
          {hasIcon && (
            <span className="breadcrumb__item-icon">
              {item.icon || (showHomeIcon && isFirst ? <HomeIcon /> : null)}
            </span>
          )}
          <span className="breadcrumb__item-text">{item.label}</span>
        </>
      );

      const itemClasses = [
        'breadcrumb__item',
        isLast && 'breadcrumb__item--current',
        item.disabled && 'breadcrumb__item--disabled',
        isCollapsed && 'breadcrumb__item--collapsed',
        hasIcon && 'breadcrumb__item--with-icon'
      ].filter(Boolean).join(' ');

      if (item.href && !item.disabled && !isLast) {
        return (
          <a
            href={item.href}
            className={itemClasses}
            onClick={(e) => handleItemClick(item, index, e)}
            aria-current={isLast ? 'page' : undefined}
          >
            {itemContent}
          </a>
        );
      }

      return (
        <span
          className={itemClasses}
          onClick={!item.disabled ? (e) => handleItemClick(item, index, e) : undefined}
          aria-current={isLast ? 'page' : undefined}
          role={!item.disabled && onItemClick ? 'button' : undefined}
          tabIndex={!item.disabled && onItemClick && !isLast ? 0 : undefined}
          onKeyDown={
            !item.disabled && onItemClick && !isLast
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item, index, e as any);
                  }
                }
              : undefined
          }
        >
          {itemContent}
        </span>
      );
    };

    // Component classes
    const breadcrumbClasses = [
      'breadcrumb',
      `breadcrumb--${size}`,
      `breadcrumb--${variant}`,
      className
    ].filter(Boolean).join(' ');

    return (
      <nav
        ref={ref}
        className={breadcrumbClasses}
        aria-label="Breadcrumb navigation"
        {...props}
      >
        <ol className="breadcrumb__list">
          {processedItems.map((item, index) => {
            const isLast = index === processedItems.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="breadcrumb__list-item">
                {renderBreadcrumbItem(item, index, isLast)}
                {!isLast && renderSep(index)}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

// Breadcrumb Item component for easier composition
export const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Legal-specific breadcrumb variants
export const LegalBreadcrumb = (props: Omit<BreadcrumbProps, 'variant'>) => (
  <Breadcrumb {...props} variant="legal" />
);

export const MinimalBreadcrumb = (props: Omit<BreadcrumbProps, 'variant'>) => (
  <Breadcrumb {...props} variant="minimal" />
);

// Hook for breadcrumb state management
export const useBreadcrumb = (initialItems: BreadcrumbItem[] = []) => {
  const [items, setItems] = React.useState<BreadcrumbItem[]>(initialItems);

  const addItem = (item: BreadcrumbItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updatedItem: Partial<BreadcrumbItem>) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i === index && item) {
          return { ...item, ...updatedItem };
        }
        return item;
      })
    );
  };

  const clearItems = () => {
    setItems([]);
  };

  const navigateToItem = (index: number) => {
    setItems(prev => prev.slice(0, index + 1));
  };

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    navigateToItem
  };
};

// Helper function to generate breadcrumb items from URL pathname
export const generateBreadcrumbsFromPath = (
  pathname: string,
  options: {
    homeLabel?: string;
    homeHref?: string;
    labelTransform?: (segment: string) => string;
    skipSegments?: string[];
  } = {}
): BreadcrumbItem[] => {
  const {
    homeLabel = 'Home',
    homeHref = '/',
    labelTransform = (segment) => segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    skipSegments = []
  } = options;

  const segments = pathname.split('/').filter(segment => 
    segment && !skipSegments.includes(segment)
  );

  const items: BreadcrumbItem[] = [
    {
      label: homeLabel,
      href: homeHref
    }
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    items.push({
      label: labelTransform(segment),
      href: currentPath
    });
  }

  return items;
};

Breadcrumb.displayName = 'Breadcrumb';
