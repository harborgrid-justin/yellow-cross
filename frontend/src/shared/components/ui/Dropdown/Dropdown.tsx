import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Dropdown.css';

export interface DropdownOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
  /** Option description */
  description?: string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Option icon */
  icon?: React.ReactNode;
  /** Custom data */
  data?: any;
}

export interface DropdownProps {
  /** Dropdown options */
  options: DropdownOption[];
  /** Selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Whether dropdown is required */
  required?: boolean;
  /** Whether dropdown is invalid */
  invalid?: boolean;
  /** Error message */
  error?: string;
  /** Dropdown label */
  label?: string;
  /** Dropdown description */
  description?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Dropdown variant */
  variant?: 'default' | 'legal' | 'outline' | 'filled';
  /** Whether to allow search/filtering */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Whether dropdown is clearable */
  clearable?: boolean;
  /** Maximum height of dropdown menu */
  maxHeight?: number;
  /** Dropdown placement */
  placement?: 'bottom' | 'top' | 'auto';
  /** Custom class name */
  className?: string;
  /** Change handler */
  onChange?: (value: string, option: DropdownOption) => void;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Clear handler */
  onClear?: () => void;
  /** Custom option renderer */
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  /** Custom trigger renderer */
  renderTrigger?: (selectedOption: DropdownOption | null, isOpen: boolean) => React.ReactNode;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({
    options = [],
    value,
    defaultValue,
    placeholder = 'Select an option...',
    disabled = false,
    required = false,
    invalid = false,
    error,
    label,
    description,
    size = 'md',
    variant = 'default',
    searchable = false,
    searchPlaceholder = 'Search...',
    clearable = false,
    maxHeight = 200,
    placement = 'auto',
    className = '',
    onChange,
    onSearch,
    onClear,
    renderOption,
    renderTrigger,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [dropdownPlacement, setDropdownPlacement] = useState<'bottom' | 'top'>('bottom');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const portalRoot = useRef<HTMLDivElement | null>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const selectedOption = options.find(option => option.value === currentValue) || null;
    const isInvalid = invalid || !!error;

    // Create portal root on mount
    useEffect(() => {
      portalRoot.current = document.createElement('div');
      portalRoot.current.className = 'dropdown-portal';
      document.body.appendChild(portalRoot.current);

      return () => {
        if (portalRoot.current) {
          document.body.removeChild(portalRoot.current);
        }
      };
    }, []);

    // Filter options based on search
    useEffect(() => {
      if (!searchable || !searchQuery) {
        setFilteredOptions(options);
        return;
      }

      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [options, searchQuery, searchable]);

    // Calculate dropdown position and placement
    const updateDropdownPosition = useCallback(() => {
      if (!triggerRef.current || !menuRef.current || !isOpen) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      let finalPlacement: 'bottom' | 'top' = 'bottom';

      if (placement === 'auto') {
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        finalPlacement = spaceBelow >= menuRect.height || spaceBelow >= spaceAbove ? 'bottom' : 'top';
      } else {
        finalPlacement = placement;
      }

      setDropdownPlacement(finalPlacement);

      // Position the menu
      const menuElement = menuRef.current;
      menuElement.style.position = 'absolute';
      menuElement.style.left = `${triggerRect.left + window.scrollX}px`;
      menuElement.style.width = `${triggerRect.width}px`;
      menuElement.style.zIndex = '9999';

      if (finalPlacement === 'bottom') {
        menuElement.style.top = `${triggerRect.bottom + scrollY}px`;
      } else {
        menuElement.style.top = `${triggerRect.top + scrollY - menuRect.height}px`;
      }
    }, [isOpen, placement]);

    // Handle dropdown position updates
    useEffect(() => {
      if (isOpen) {
        updateDropdownPosition();
        
        const handleScroll = () => updateDropdownPosition();
        const handleResize = () => updateDropdownPosition();
        
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('scroll', handleScroll, true);
          window.removeEventListener('resize', handleResize);
        };
      }
    }, [isOpen, updateDropdownPosition]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
            setFocusedIndex(selectedOption ? filteredOptions.findIndex(opt => opt.value === selectedOption.value) : 0);
          } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            event.preventDefault();
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex(prev => (prev + 1) % filteredOptions.length);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(filteredOptions.length - 1);
          } else {
            setFocusedIndex(prev => prev <= 0 ? filteredOptions.length - 1 : prev - 1);
          }
          break;
        case 'Tab':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    // Handle option selection
    const handleOptionSelect = (option: DropdownOption) => {
      if (option.disabled) return;

      if (value === undefined) {
        setInternalValue(option.value);
      }
      onChange?.(option.value, option);
      setIsOpen(false);
      setFocusedIndex(-1);
      setSearchQuery('');
      triggerRef.current?.focus();
    };

    // Handle clear
    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (value === undefined) {
        setInternalValue('');
      }
      onClear?.();
      onChange?.('', {} as DropdownOption);
      triggerRef.current?.focus();
    };

    // Handle search
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      setFocusedIndex(0);
      onSearch?.(query);
    };

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        setTimeout(() => searchRef.current?.focus(), 0);
      }
    }, [isOpen, searchable]);

    // Component classes
    const dropdownClasses = [
      'dropdown',
      `dropdown--${size}`,
      `dropdown--${variant}`,
      isOpen && 'dropdown--open',
      disabled && 'dropdown--disabled',
      isInvalid && 'dropdown--invalid',
      className
    ].filter(Boolean).join(' ');

    const menuClasses = [
      'dropdown__menu',
      `dropdown__menu--${dropdownPlacement}`,
      searchable && 'dropdown__menu--searchable'
    ].filter(Boolean).join(' ');

    // Render option
    const renderOptionContent = (option: DropdownOption, index: number) => {
      const isSelected = option.value === currentValue;
      const isFocused = index === focusedIndex;

      if (renderOption) {
        return renderOption(option, isSelected);
      }

      return (
        <div className="dropdown__option-content">
          {option.icon && <span className="dropdown__option-icon">{option.icon}</span>}
          <div className="dropdown__option-text">
            <span className="dropdown__option-label">{option.label}</span>
            {option.description && (
              <span className="dropdown__option-description">{option.description}</span>
            )}
          </div>
        </div>
      );
    };

    // Render trigger
    const renderTriggerContent = () => {
      if (renderTrigger) {
        return renderTrigger(selectedOption, isOpen);
      }

      return (
        <>
          <span className="dropdown__trigger-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {clearable && selectedOption && (
            <button
              type="button"
              className="dropdown__clear"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
          <span className="dropdown__trigger-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </>
      );
    };

    // Dropdown menu content
    const dropdownMenu = (
      <div
        ref={menuRef}
        className={menuClasses}
        style={{ maxHeight }}
        role="listbox"
        aria-multiselectable={false}
      >
        {searchable && (
          <div className="dropdown__search">
            <input
              ref={searchRef}
              type="text"
              className="dropdown__search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  handleKeyDown(e);
                }
              }}
            />
          </div>
        )}
        <div className="dropdown__options">
          {filteredOptions.length === 0 ? (
            <div className="dropdown__no-options">
              {searchQuery ? 'No options found' : 'No options available'}
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = option.value === currentValue;
              const isFocused = index === focusedIndex;

              return (
                <div
                  key={option.value}
                  className={[
                    'dropdown__option',
                    isSelected && 'dropdown__option--selected',
                    isFocused && 'dropdown__option--focused',
                    option.disabled && 'dropdown__option--disabled'
                  ].filter(Boolean).join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {renderOptionContent(option, index)}
                </div>
              );
            })
          )}
        </div>
      </div>
    );

    return (
      <div ref={dropdownRef} className={dropdownClasses} {...props}>
        {label && (
          <label className="dropdown__label">
            {label}
            {required && <span className="dropdown__required">*</span>}
          </label>
        )}
        {description && <p className="dropdown__description">{description}</p>}
        
        <div className="dropdown__container">
          <button
            ref={(node) => {
              triggerRef.current = node;
              if (typeof ref === 'function') {
                ref(node?.parentElement as HTMLDivElement);
              } else if (ref?.current !== undefined) {
                ref.current = node?.parentElement as HTMLDivElement;
              }
            }}
            type="button"
            className="dropdown__trigger"
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onKeyDown={handleKeyDown}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {renderTriggerContent()}
          </button>
        </div>

        {error && <span className="dropdown__error">{error}</span>}

        {isOpen && portalRoot.current && createPortal(dropdownMenu, portalRoot.current)}
      </div>
    );
  }
);

// Legal-specific dropdown variants
export const LegalDropdown = (props: Omit<DropdownProps, 'variant'>) => (
  <Dropdown {...props} variant="legal" />
);

export const OutlineDropdown = (props: Omit<DropdownProps, 'variant'>) => (
  <Dropdown {...props} variant="outline" />
);

Dropdown.displayName = 'Dropdown';
