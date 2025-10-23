import React, { forwardRef, createContext, useContext, useState, useRef, useEffect } from 'react';
import './Tabs.css';

/**
 * TabItem - Configuration for a single tab
 * 
 * @typedef {Object} TabItem
 * @property {string} id - Unique tab identifier
 * @property {string} label - Tab label text
 * @property {React.ReactNode} [content] - Tab content panel
 * @property {boolean} [disabled] - Whether tab is disabled
 * @property {React.ReactNode} [icon] - Tab icon element
 * @property {React.ReactNode} [badge] - Badge content for tab
 * @property {boolean} [closable] - Whether tab can be closed
 */
export interface TabItem {
  /** Tab identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Tab content */
  content?: React.ReactNode;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Tab icon */
  icon?: React.ReactNode;
  /** Badge content */
  badge?: React.ReactNode;
  /** Whether tab is closable */
  closable?: boolean;
}

/**
 * TabsProps - Props for the Tabs component
 * 
 * @typedef {Object} TabsProps
 * @property {TabItem[]} [items] - Array of tab configurations
 * @property {string} [activeTab] - Controlled active tab ID
 * @property {string} [defaultActiveTab] - Default active tab ID
 * @property {('default'|'pills'|'underline'|'legal'|'minimal')} [variant='default'] - Visual style
 * @property {('sm'|'md'|'lg')} [size='md'] - Size variant
 * @property {('horizontal'|'vertical')} [orientation='horizontal'] - Tab orientation
 * @property {boolean} [scrollable=false] - Enable scrolling for many tabs
 * @property {boolean} [showIndicator=true] - Show active tab indicator
 * @property {string} [className] - Additional CSS classes
 * @property {Function} [onChange] - Tab change handler
 */
export interface TabsProps {
  /** Tab items */
  items?: TabItem[];
  /** Active tab ID */
  activeTab?: string;
  /** Default active tab ID */
  defaultActiveTab?: string;
  /** Tabs variant */
  variant?: 'default' | 'pills' | 'underline' | 'legal' | 'minimal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Tabs orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether tabs are scrollable */
  scrollable?: boolean;
  /** Whether to show tab indicators */
  showIndicator?: boolean;
  /** Custom class name */
  className?: string;
  /** Tab change handler */
  onTabChange?: (tabId: string) => void;
  /** Tab close handler */
  onTabClose?: (tabId: string) => void;
  /** Custom tab renderer */
  renderTab?: (item: TabItem, isActive: boolean) => React.ReactNode;
  /** Custom content renderer */
  renderContent?: (item: TabItem) => React.ReactNode;
  /** Children for compound component usage */
  children?: React.ReactNode;
}

export interface TabListProps {
  /** Custom class name */
  className?: string;
  /** Children tab buttons */
  children: React.ReactNode;
}

export interface TabProps {
  /** Tab identifier */
  id: string;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

export interface TabPanelProps {
  /** Associated tab ID */
  tabId: string;
  /** Custom class name */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

// Tabs Context
interface TabsContextValue {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant: string;
  size: string;
  orientation: string;
  disabled?: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs component');
  }
  return context;
};

/**
 * Tabs - Tabbed interface component with multiple variants
 * 
 * A comprehensive tabs component supporting multiple visual styles,
 * orientations, and advanced features like closable tabs, badges,
 * and custom rendering. Can be used with items prop or as compound
 * component with Tab and TabPanel children.
 * 
 * Features:
 * - Five visual variants (default, pills, underline, legal, minimal)
 * - Horizontal and vertical orientation
 * - Scrollable tabs for overflow handling
 * - Closable tabs with onClose handler
 * - Tab icons and badges
 * - Controlled and uncontrolled modes
 * - Compound component pattern support
 * - Active tab indicator
 * - Forward ref support
 * 
 * @component
 * @param {TabsProps} props - Component props
 * @param {TabItem[]} [props.items] - Tab configurations
 * @param {string} [props.activeTab] - Controlled active tab ID
 * @param {string} [props.defaultActiveTab] - Default active tab
 * @param {string} [props.variant='default'] - Visual style
 * @param {string} [props.size='md'] - Size variant
 * @param {string} [props.orientation='horizontal'] - Tab orientation
 * @param {boolean} [props.scrollable=false] - Enable scrolling
 * @param {boolean} [props.showIndicator=true] - Show active indicator
 * @param {Function} [props.onTabChange] - Tab change callback
 * @param {Function} [props.onTabClose] - Tab close callback
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * 
 * @returns {JSX.Element} Tabs component
 * 
 * @example
 * // Basic tabs with items
 * <Tabs
 *   items={[
 *     { id: 'tab1', label: 'Overview', content: <Overview /> },
 *     { id: 'tab2', label: 'Details', content: <Details /> }
 *   ]}
 * />
 * 
 * @example
 * // Controlled tabs
 * <Tabs
 *   items={tabs}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   variant="pills"
 * />
 * 
 * @example
 * // Tabs with icons and badges
 * <Tabs
 *   items={[
 *     { 
 *       id: 'inbox', 
 *       label: 'Inbox', 
 *       icon: <InboxIcon />,
 *       badge: <Badge>5</Badge>
 *     }
 *   ]}
 * />
 */
// Main Tabs Component
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({
    items = [],
    activeTab,
    defaultActiveTab,
    variant = 'default',
    size = 'md',
    orientation = 'horizontal',
    scrollable = false,
    showIndicator = true,
    className = '',
    onTabChange,
    onTabClose,
    renderTab,
    renderContent,
    children,
    ...props
  }, ref) => {
    const [internalActiveTab, setInternalActiveTab] = useState(() => {
      if (defaultActiveTab) return defaultActiveTab;
      if (items.length > 0) return items[0].id;
      return '';
    });

    const tabListRef = useRef<HTMLDivElement>(null);
    const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;

    // Handle tab change
    const handleTabChange = (tabId: string) => {
      if (activeTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    };

    // Handle tab close
    const handleTabClose = (tabId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      onTabClose?.(tabId);
    };

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
      const tabItems = items.filter(item => !item.disabled);
      const currentIndex = tabItems.findIndex(item => item.id === tabId);
      
      let nextIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabItems.length - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = currentIndex < tabItems.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = tabItems.length - 1;
          break;
        default:
          return;
      }
      
      const nextTab = tabItems[nextIndex];
      if (nextTab) {
        handleTabChange(nextTab.id);
        // Focus the next tab button
        setTimeout(() => {
          if (tabListRef.current) {
            const tabButton = tabListRef.current.querySelector(`[data-tab-id="${nextTab.id}"]`) as HTMLButtonElement;
            tabButton?.focus();
          }
        }, 0);
      }
    };

    // Component classes
    const tabsClasses = [
      'tabs',
      `tabs--${variant}`,
      `tabs--${size}`,
      `tabs--${orientation}`,
      scrollable && 'tabs--scrollable',
      className
    ].filter(Boolean).join(' ');

    const contextValue: TabsContextValue = {
      activeTab: currentActiveTab,
      onTabChange: handleTabChange,
      variant,
      size,
      orientation
    };

    // Render tab button
    const renderTabButton = (item: TabItem) => {
      const isActive = item.id === currentActiveTab;
      
      if (renderTab) {
        return renderTab(item, isActive);
      }

      return (
        <button
          key={item.id}
          data-tab-id={item.id}
          className={[
            'tabs__tab',
            isActive && 'tabs__tab--active',
            item.disabled && 'tabs__tab--disabled'
          ].filter(Boolean).join(' ')}
          onClick={() => !item.disabled && handleTabChange(item.id)}
          onKeyDown={(e) => handleKeyDown(e, item.id)}
          disabled={item.disabled}
          role="tab"
          aria-selected={isActive}
          aria-controls={`tabpanel-${item.id}`}
          tabIndex={isActive ? 0 : -1}
        >
          {item.icon && <span className="tabs__tab-icon">{item.icon}</span>}
          <span className="tabs__tab-text">{item.label}</span>
          {item.badge && <span className="tabs__tab-badge">{item.badge}</span>}
          {item.closable && (
            <button
              className="tabs__tab-close"
              onClick={(e) => handleTabClose(item.id, e)}
              aria-label={`Close ${item.label} tab`}
            >
              ×
            </button>
          )}
        </button>
      );
    };

    // Render tab content
    const renderTabContent = () => {
      const activeItem = items.find(item => item.id === currentActiveTab);
      if (!activeItem) return null;

      if (renderContent) {
        return renderContent(activeItem);
      }

      return (
        <div
          className="tabs__content"
          role="tabpanel"
          id={`tabpanel-${activeItem.id}`}
          aria-labelledby={`tab-${activeItem.id}`}
        >
          {activeItem.content}
        </div>
      );
    };

    // If using compound components
    if (children) {
      return (
        <TabsContext.Provider value={contextValue}>
          <div ref={ref} className={tabsClasses} {...props}>
            {children}
          </div>
        </TabsContext.Provider>
      );
    }

    // Standard usage with items prop
    return (
      <div ref={ref} className={tabsClasses} {...props}>
        <div
          ref={tabListRef}
          className="tabs__list"
          role="tablist"
          aria-orientation={orientation}
        >
          {items.map(renderTabButton)}
          {showIndicator && (
            <div className="tabs__indicator" aria-hidden="true" />
          )}
        </div>
        {renderTabContent()}
      </div>
    );
  }
);

// Tab List Component (for compound usage)
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className = '', children, ...props }, ref) => {
    const { orientation } = useTabsContext();
    
    const tabListClasses = [
      'tabs__list',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={tabListClasses}
        role="tablist"
        aria-orientation={orientation as 'horizontal' | 'vertical'}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Tab Component (for compound usage)
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ id, disabled = false, className = '', children, ...props }, ref) => {
    const { activeTab, onTabChange, variant } = useTabsContext();
    const isActive = id === activeTab;

    const tabClasses = [
      'tabs__tab',
      isActive && 'tabs__tab--active',
      disabled && 'tabs__tab--disabled',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        data-tab-id={id}
        className={tabClasses}
        onClick={() => !disabled && onTabChange(id)}
        disabled={disabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${id}`}
        tabIndex={isActive ? 0 : -1}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Tab Panel Component (for compound usage)
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, className = '', children, ...props }, ref) => {
    const { activeTab } = useTabsContext();
    const isActive = tabId === activeTab;

    if (!isActive) return null;

    const tabPanelClasses = [
      'tabs__content',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={tabPanelClasses}
        role="tabpanel"
        id={`tabpanel-${tabId}`}
        aria-labelledby={`tab-${tabId}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Legal-specific tab variants
export const LegalTabs = (props: Omit<TabsProps, 'variant'>) => (
  <Tabs {...props} variant="legal" />
);

export const MinimalTabs = (props: Omit<TabsProps, 'variant'>) => (
  <Tabs {...props} variant="minimal" />
);

// Hook for tab state management
export const useTabs = (initialTab?: string) => {
  const [activeTab, setActiveTab] = useState(initialTab || '');
  const [tabs, setTabs] = useState<TabItem[]>([]);

  const addTab = (tab: TabItem) => {
    setTabs(prev => [...prev, tab]);
    if (!activeTab) {
      setActiveTab(tab.id);
    }
  };

  const removeTab = (tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      if (tabId === activeTab && filtered.length > 0) {
        setActiveTab(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateTab = (tabId: string, updates: Partial<TabItem>) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      )
    );
  };

  return {
    activeTab,
    setActiveTab,
    tabs,
    setTabs,
    addTab,
    removeTab,
    updateTab
  };
};

Tabs.displayName = 'Tabs';
TabList.displayName = 'TabList';
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
