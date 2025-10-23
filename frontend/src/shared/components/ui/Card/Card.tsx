import React, { forwardRef } from 'react';
import './Card.css';

/**
 * CardProps - Props for the Card component
 * 
 * Extends native HTML div attributes with additional options for styling
 * and interaction behavior.
 * 
 * @typedef {Object} CardProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 * @property {('default'|'outlined'|'elevated'|'filled')} [variant='default'] - Visual style variant
 * @property {('sm'|'md'|'lg')} [size='md'] - Card size
 * @property {('none'|'sm'|'md'|'lg')} [padding='md'] - Internal padding
 * @property {boolean} [hover=false] - Enable hover effects
 * @property {boolean} [interactive=false] - Make card interactive (clickable appearance)
 * @property {React.ReactNode} children - Card content
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

/**
 * Card - Reusable card container component
 * 
 * A flexible card component that provides a consistent container for content
 * throughout the application. Supports different visual variants, sizes, and
 * interaction states. Cards can be used for displaying grouped information,
 * list items, or as clickable containers.
 * 
 * Features:
 * - Multiple style variants (default, outlined, elevated, filled)
 * - Three size options affecting overall dimensions
 * - Configurable padding (none, sm, md, lg)
 * - Optional hover effects
 * - Interactive mode for clickable cards
 * - Forward ref support for parent component access
 * 
 * @component
 * @param {CardProps} props - Component props
 * @param {('default'|'outlined'|'elevated'|'filled')} [props.variant='default'] - Visual style variant
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Card size affecting dimensions
 * @param {('none'|'sm'|'md'|'lg')} [props.padding='md'] - Internal padding amount
 * @param {boolean} [props.hover=false] - Enable hover shadow/border effects
 * @param {boolean} [props.interactive=false] - Make card appear clickable with cursor pointer
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to the div element
 * 
 * @returns {JSX.Element} Rendered card container
 * 
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content here</p>
 * </Card>
 * 
 * @example
 * // Elevated card with hover effect
 * <Card variant="elevated" hover>
 *   <p>Hover over me</p>
 * </Card>
 * 
 * @example
 * // Interactive clickable card
 * <Card 
 *   variant="outlined" 
 *   interactive 
 *   hover
 *   onClick={handleCardClick}
 * >
 *   <h4>Clickable Card</h4>
 *   <p>Click anywhere on this card</p>
 * </Card>
 * 
 * @example
 * // Large card with no padding
 * <Card size="lg" padding="none">
 *   <img src="hero.jpg" alt="Hero" />
 *   <div style={{ padding: '1rem' }}>
 *     <h3>Custom padded content</h3>
 *   </div>
 * </Card>
 * 
 * @example
 * // Filled card with small size
 * <Card variant="filled" size="sm">
 *   <span>Compact card</span>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      padding = 'md',
      hover = false,
      interactive = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'card',
      `card--${variant}`,
      `card--${size}`,
      `card--padding-${padding}`,
      hover && 'card--hover',
      interactive && 'card--interactive',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card__header ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', className = '', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`card__title ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`card__description ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card__content ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card__footer ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
