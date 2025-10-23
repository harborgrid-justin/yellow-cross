import React, { forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * ModalProps - Props for the Modal component
 * 
 * Configuration options for the modal dialog including size, behavior,
 * and content properties.
 * 
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls modal visibility
 * @property {Function} onClose - Callback fired when modal should close
 * @property {string} [title] - Optional modal title
 * @property {string} [description] - Optional modal description
 * @property {('sm'|'md'|'lg'|'xl'|'full')} [size='md'] - Modal size
 * @property {boolean} [closeOnOverlayClick=true] - Close when clicking overlay
 * @property {boolean} [closeOnEscape=true] - Close when pressing Escape key
 * @property {boolean} [showCloseButton=true] - Show close button in header
 * @property {boolean} [preventBodyScroll=true] - Prevent body scrolling when open
 * @property {string} [className] - Additional CSS classes for modal content
 * @property {string} [overlayClassName] - Additional CSS classes for overlay
 * @property {React.ReactNode} children - Modal content
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventBodyScroll?: boolean;
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
}

/**
 * Modal - Accessible modal dialog component with overlay
 * 
 * A full-featured modal dialog component that renders in a React portal,
 * providing a focus-trapped overlay for displaying content above the main
 * application. Supports various sizes, keyboard navigation, click-outside
 * closing, and body scroll prevention.
 * 
 * Features:
 * - Renders via React portal for proper stacking
 * - Five size options (sm, md, lg, xl, full)
 * - Optional title and description
 * - Keyboard navigation (Escape to close)
 * - Click outside to close (configurable)
 * - Focus trap for accessibility
 * - Body scroll prevention
 * - Close button in header
 * - Smooth open/close animations
 * - Forward ref support
 * 
 * @component
 * @param {ModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether modal is currently visible
 * @param {Function} props.onClose - Handler called when modal should close
 * @param {string} [props.title] - Modal title shown in header
 * @param {string} [props.description] - Modal description shown below title
 * @param {('sm'|'md'|'lg'|'xl'|'full')} [props.size='md'] - Modal size
 * @param {boolean} [props.closeOnOverlayClick=true] - Allow closing by clicking overlay
 * @param {boolean} [props.closeOnEscape=true] - Allow closing with Escape key
 * @param {boolean} [props.showCloseButton=true] - Show X button in header
 * @param {boolean} [props.preventBodyScroll=true] - Prevent scrolling page behind modal
 * @param {string} [props.className] - Additional classes for modal content
 * @param {string} [props.overlayClassName] - Additional classes for overlay
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to modal content div
 * 
 * @returns {JSX.Element|null} Modal portal or null if not open
 * 
 * @example
 * // Basic modal
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal 
 *   isOpen={isOpen} 
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to continue?</p>
 *   <Button onClick={() => setIsOpen(false)}>Confirm</Button>
 * </Modal>
 * 
 * @example
 * // Large modal with description
 * <Modal 
 *   isOpen={showDetails}
 *   onClose={handleClose}
 *   title="Case Details"
 *   description="Review all case information below"
 *   size="lg"
 * >
 *   <CaseDetailsForm />
 * </Modal>
 * 
 * @example
 * // Full screen modal without overlay close
 * <Modal 
 *   isOpen={isEditing}
 *   onClose={handleClose}
 *   title="Edit Document"
 *   size="full"
 *   closeOnOverlayClick={false}
 *   closeOnEscape={false}
 * >
 *   <DocumentEditor />
 * </Modal>
 * 
 * @example
 * // Modal with custom styling
 * <Modal 
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   className="custom-modal-content"
 *   overlayClassName="custom-overlay"
 * >
 *   <CustomContent />
 * </Modal>
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      preventBodyScroll = true,
      className = '',
      overlayClassName = '',
      children,
    },
    ref
  ) => {
    // Handle escape key
    const handleEscape = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      },
      [onClose, closeOnEscape]
    );

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    // Manage body scroll
    useEffect(() => {
      if (isOpen && preventBodyScroll) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
    }, [isOpen, preventBodyScroll]);

    // Add escape key listener
    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => {
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const modalClasses = [
      'modal',
      `modal--${size}`,
      className
    ].filter(Boolean).join(' ');

    const overlayClasses = [
      'modal-overlay',
      overlayClassName
    ].filter(Boolean).join(' ');

    const modal = (
      <div className={overlayClasses} onClick={handleOverlayClick}>
        <div
          ref={ref}
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {(title || showCloseButton) && (
            <div className="modal__header">
              <div className="modal__header-content">
                {title && (
                  <h2 id="modal-title" className="modal__title">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="modal__description">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  className="modal__close-button"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          <div className="modal__content">
            {children}
          </div>
        </div>
      </div>
    );

    return createPortal(modal, document.body);
  }
);

Modal.displayName = 'Modal';

// Modal sub-components
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`modal__header ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ as: Component = 'h2', className = '', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`modal__title ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ModalTitle.displayName = 'ModalTitle';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`modal__body ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`modal__footer ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';
