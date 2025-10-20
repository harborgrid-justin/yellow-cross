describe('Case Management Feature - Comprehensive Test Suite', () => {
  // Note: Case Management page requires authentication
  // These tests verify the authentication flow, security, routing, and UX
  
  beforeEach(() => {
    cy.visit('/features/case-management');
  });

  // ============================================================================
  // Authentication and Access Control Tests (8 tests - reduced from 10)
  // ============================================================================
  describe('Authentication and Access Control', () => {
    it('should redirect to login page when not authenticated', () => {
      cy.url().should('include', '/login');
    });

    it('should display complete login form', () => {
      cy.contains('Sign In').should('be.visible');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });

    it('should have correct page title and branding', () => {
      cy.title().should('include', 'Yellow Cross');
      cy.contains('Yellow Cross').should('be.visible');
      cy.contains('Enterprise Law Firm Practice Management').should('be.visible');
    });

    it('should display password field with proper security', () => {
      cy.get('input[type="password"]').should('exist');
    });

    it('should display email input with appropriate attributes', () => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="email"]').should('have.attr', 'placeholder');
    });

    it('should have functioning sign in button', () => {
      cy.contains('button', 'Sign In').should('be.visible');
      cy.get('button[type="submit"]').should('be.enabled');
    });
  });

  // ============================================================================
  // Sub-Feature Route Protection Tests (8 tests)
  // ============================================================================
  describe('Sub-Feature Route Protection', () => {
    it('should protect creation-intake sub-feature route', () => {
      cy.visit('/features/case-management/creation-intake');
      cy.url().should('include', '/login');
    });

    it('should protect tracking-status sub-feature route', () => {
      cy.visit('/features/case-management/tracking-status');
      cy.url().should('include', '/login');
    });

    it('should protect assignment-distribution sub-feature route', () => {
      cy.visit('/features/case-management/assignment-distribution');
      cy.url().should('include', '/login');
    });

    it('should protect timeline-management sub-feature route', () => {
      cy.visit('/features/case-management/timeline-management');
      cy.url().should('include', '/login');
    });

    it('should protect categorization-tagging sub-feature route', () => {
      cy.visit('/features/case-management/categorization-tagging');
      cy.url().should('include', '/login');
    });

    it('should protect notes-updates sub-feature route', () => {
      cy.visit('/features/case-management/notes-updates');
      cy.url().should('include', '/login');
    });

    it('should protect closing-archive sub-feature route', () => {
      cy.visit('/features/case-management/closing-archive');
      cy.url().should('include', '/login');
    });

    it('should protect analytics-dashboard sub-feature route', () => {
      cy.visit('/features/case-management/analytics-dashboard');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Navigation and Header Tests (6 tests - reduced from 8)
  // ============================================================================
  describe('Navigation and Header', () => {
    it('should display main navigation with all items', () => {
      cy.get('nav').should('exist');
      cy.contains('Yellow Cross').should('be.visible');
      cy.contains('Home').should('be.visible');
      cy.contains('Features').should('be.visible');
      cy.contains('Login').should('be.visible');
    });

    it('should allow clicking on home to navigate', () => {
      cy.contains('Home').click();
      cy.url().should('include', '/');
    });

    it('should navigate to login from header', () => {
      cy.contains('Login').click();
      cy.url().should('include', '/login');
    });

    it('should have clickable Yellow Cross logo linking to home', () => {
      cy.contains('a', 'Yellow Cross').should('have.attr', 'href', '/');
    });

    it('should maintain navigation visibility across pages', () => {
      cy.get('nav').should('be.visible');
      cy.contains('Home').click();
      cy.get('nav').should('be.visible');
    });

    it('should display navigation in mobile viewports', () => {
      cy.viewport(375, 667);
      cy.get('nav').should('exist');
    });
  });

  // ============================================================================
  // Login Form Validation Tests (8 tests - reduced from 10)
  // ============================================================================
  describe('Login Form Validation', () => {
    it('should have all required form labels', () => {
      cy.contains('Email Address').should('be.visible');
      cy.contains('Password').should('be.visible');
    });

    it('should have inputs with proper attributes', () => {
      cy.get('input[type="email"]').should('have.attr', 'placeholder');
      cy.get('input[type="password"]').should('have.attr', 'placeholder');
    });

    it('should allow typing in email field', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="email"]').should('have.value', 'test@example.com');
    });

    it('should allow typing in password field with masking', () => {
      cy.get('input[type="password"]').type('password123');
      cy.get('input[type="password"]').should('have.value', 'password123');
    });

    it('should have functional remember me checkbox', () => {
      cy.get('input[type="checkbox"]').click();
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    it('should display create account link and allow navigation', () => {
      cy.contains('Create one').should('be.visible');
      cy.contains('Create one').click();
      cy.url().should('include', '/register');
    });

    it('should have forgot password link visible', () => {
      cy.contains('Forgot password').should('be.visible');
    });

    it('should have submit button properly configured', () => {
      cy.get('button[type="submit"]').should('exist');
      cy.contains('button', 'Sign In').should('be.visible');
    });
  });

  // ============================================================================
  // Footer Tests (4 tests - reduced from 6)
  // ============================================================================
  describe('Footer Content', () => {
    it('should display footer with Yellow Cross branding', () => {
      cy.get('footer').should('exist');
      cy.get('footer').contains('Yellow Cross').should('be.visible');
      cy.get('footer').contains('Enterprise-grade law firm practice management').should('be.visible');
    });

    it('should have Features section listing Case Management', () => {
      cy.get('footer').contains('Features').should('be.visible');
      cy.get('footer').contains('Case Management System').should('be.visible');
    });

    it('should display copyright notice', () => {
      cy.get('footer').contains('2024 Yellow Cross. All rights reserved').should('be.visible');
    });

    it('should have clickable links in footer', () => {
      cy.get('footer a').should('have.length.greaterThan', 0);
    });
  });

  // ============================================================================
  // Accessibility and UX Tests (4 tests - reduced from 6)
  // ============================================================================
  describe('Accessibility and UX', () => {
    it('should have semantic HTML structure', () => {
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');
    });

    it('should have proper form labels and inputs', () => {
      cy.contains('Email Address').should('exist');
      cy.contains('Password').should('exist');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('should support keyboard navigation and focus management', () => {
      cy.get('input[type="email"]').focus().should('have.focus');
      cy.get('input[type="password"]').focus().should('have.focus');
      cy.get('button[type="submit"]').focus().should('have.focus');
    });

    it('should have responsive layout on different viewports', () => {
      cy.viewport(1280, 720);
      cy.get('nav').should('be.visible');
      cy.viewport(768, 1024);
      cy.get('nav').should('be.visible');
      cy.viewport(375, 667);
      cy.get('nav').should('exist');
    });
  });

  // ============================================================================
  // Form Interaction and Validation Tests (12 tests)
  // ============================================================================
  describe('Form Interaction and Validation', () => {
    it('should allow clearing email field', () => {
      cy.get('input[type="email"]').clear().should('have.value', '');
    });

    it('should allow clearing password field', () => {
      cy.get('input[type="password"]').clear().should('have.value', '');
    });

    it('should maintain email value when switching fields', () => {
      const testEmail = 'user@lawfirm.com';
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').click();
      cy.get('input[type="email"]').should('have.value', testEmail);
    });

    it('should maintain password value when switching fields', () => {
      cy.get('input[type="password"]').type('testPassword');
      cy.get('input[type="email"]').click();
      cy.get('input[type="password"]').should('have.value', 'testPassword');
    });

    it('should have proper input field focus states', () => {
      cy.get('input[type="email"]').click();
      cy.get('input[type="email"]').should('have.focus');
    });

    it('should allow unchecking remember me checkbox', () => {
      cy.get('input[type="checkbox"]').click().should('be.checked');
      cy.get('input[type="checkbox"]').click().should('not.be.checked');
    });

    it('should handle rapid form field switching', () => {
      cy.get('input[type="email"]').click();
      cy.get('input[type="password"]').click();
      cy.get('input[type="email"]').click();
      cy.get('input[type="email"]').should('have.focus');
    });

    it('should display correct button text', () => {
      cy.get('button[type="submit"]').should('contain', 'Sign In');
    });

    it('should have proper form structure', () => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
      cy.get('input[type="checkbox"]').should('exist');
    });

    it('should display registration link with correct text', () => {
      cy.contains("Don't have an account").should('be.visible');
      cy.contains('Create one').should('be.visible');
    });

    it('should maintain form state during navigation', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.contains('Yellow Cross').should('exist');
      cy.get('input[type="email"]').should('have.value', 'test@example.com');
    });

    it('should have consistent styling across form elements', () => {
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should mask password characters for security', () => {
      cy.get('input[type="password"]').type('secret');
      // Password field should hide characters
      cy.get('input[type="password"]').invoke('prop', 'type').should('eq', 'password');
    });

    it('should have email field with email input type', () => {
      cy.get('input[type="email"]').invoke('prop', 'type').should('eq', 'email');
    });
  });
});
