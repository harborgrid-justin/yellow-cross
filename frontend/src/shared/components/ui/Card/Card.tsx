import React, { forwardRef } from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

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
