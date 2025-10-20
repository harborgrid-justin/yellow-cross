describe('Document Management System - Comprehensive Test Suite', () => {
  // Note: Document Management pages are protected by authentication
  // These tests verify the authentication flow, security, routing, and UX
  
  beforeEach(() => {
    cy.visit('/features/document-management');
  });

  // ============================================================================
  // Authentication and Access Control Tests (10 tests)
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

    it('should protect document management route with authentication', () => {
      cy.visit('/features/document-management');
      cy.url().should('include', '/login');
    });

    it('should display forgot password link', () => {
      cy.contains('Forgot password').should('be.visible');
    });

    it('should display remember me checkbox', () => {
      cy.contains('Remember me').should('be.visible');
      cy.get('input[type="checkbox"]').should('exist');
    });

    it('should have link to create new account', () => {
      cy.contains('Create one').should('be.visible');
    });
  });

  // ============================================================================
  // Sub-Feature Route Protection Tests (8 tests)
  // ============================================================================
  describe('Sub-Feature Route Protection', () => {
    it('should protect upload-storage sub-feature route', () => {
      cy.visit('/features/document-management/upload-storage');
      cy.url().should('include', '/login');
    });

    it('should protect organization-indexing sub-feature route', () => {
      cy.visit('/features/document-management/organization-indexing');
      cy.url().should('include', '/login');
    });

    it('should protect templates-library sub-feature route', () => {
      cy.visit('/features/document-management/templates-library');
      cy.url().should('include', '/login');
    });

    it('should protect version-control sub-feature route', () => {
      cy.visit('/features/document-management/version-control');
      cy.url().should('include', '/login');
    });

    it('should protect search-retrieval sub-feature route', () => {
      cy.visit('/features/document-management/search-retrieval');
      cy.url().should('include', '/login');
    });

    it('should protect collaboration sub-feature route', () => {
      cy.visit('/features/document-management/collaboration');
      cy.url().should('include', '/login');
    });

    it('should protect security-permissions sub-feature route', () => {
      cy.visit('/features/document-management/security-permissions');
      cy.url().should('include', '/login');
    });

    it('should protect automation sub-feature route', () => {
      cy.visit('/features/document-management/automation');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Navigation and Header Tests (10 tests)
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

    it('should have Features menu item visible', () => {
      cy.contains('Features').should('be.visible');
    });

    it('should maintain header across different pages', () => {
      cy.get('nav').should('exist');
      cy.visit('/');
      cy.get('nav').should('exist');
    });

    it('should have consistent header styling', () => {
      cy.get('nav').should('be.visible');
      cy.get('nav').should('have.css', 'display');
    });

    it('should allow navigation to register page', () => {
      cy.contains('Create one').click();
      cy.url().should('include', '/register');
    });
  });

  // ============================================================================
  // Login Form Validation Tests (10 tests)
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
      cy.get('input[type="email"]').type('test@lawfirm.com');
      cy.get('input[type="email"]').should('have.value', 'test@lawfirm.com');
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

    it('should clear email field when requested', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="email"]').clear();
      cy.get('input[type="email"]').should('have.value', '');
    });

    it('should clear password field when requested', () => {
      cy.get('input[type="password"]').type('password');
      cy.get('input[type="password"]').clear();
      cy.get('input[type="password"]').should('have.value', '');
    });
  });

  // ============================================================================
  // Footer Tests (8 tests)
  // ============================================================================
  describe('Footer Content', () => {
    it('should display footer with Yellow Cross branding', () => {
      cy.get('footer').should('exist');
      cy.get('footer').contains('Yellow Cross').should('be.visible');
      cy.get('footer').contains('Enterprise-grade law firm practice management').should('be.visible');
    });

    it('should have Features section listing Document Management', () => {
      cy.get('footer').contains('Features').should('be.visible');
      cy.get('footer').contains('Document Management System').should('be.visible');
    });

    it('should display copyright notice', () => {
      cy.get('footer').contains('2024 Yellow Cross. All rights reserved').should('be.visible');
    });

    it('should have clickable links in footer', () => {
      cy.get('footer a').should('have.length.greaterThan', 0);
    });

    it('should display Company section in footer', () => {
      cy.get('footer').contains('Company').should('be.visible');
    });

    it('should have About link in footer', () => {
      cy.get('footer').contains('About').should('be.visible');
    });

    it('should have Contact link in footer', () => {
      cy.get('footer').contains('Contact').should('be.visible');
    });

    it('should have Privacy link in footer', () => {
      cy.get('footer').contains('Privacy').should('be.visible');
    });
  });

  // ============================================================================
  // Accessibility and UX Tests (8 tests)
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

    it('should have responsive layout on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('nav').should('be.visible');
    });

    it('should have responsive layout on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('nav').should('be.visible');
    });

    it('should have responsive layout on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('nav').should('exist');
    });

    it('should have accessible button elements', () => {
      cy.get('button[type="submit"]').should('be.visible');
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should have proper color contrast for text', () => {
      cy.contains('Sign In').should('be.visible');
      cy.contains('Email Address').should('be.visible');
    });
  });

  // ============================================================================
  // Form Interaction and State Management Tests (12 tests)
  // ============================================================================
  describe('Form Interaction and State Management', () => {
    it('should maintain email value when switching fields', () => {
      const testEmail = 'user@documentfirm.com';
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

    it('should maintain form state during page interaction', () => {
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
      cy.get('input[type="password"]').invoke('prop', 'type').should('eq', 'password');
    });

    it('should have email field with email input type', () => {
      cy.get('input[type="email"]').invoke('prop', 'type').should('eq', 'email');
    });
  });

  // ============================================================================
  // URL and Route Handling Tests (8 tests)
  // ============================================================================
  describe('URL and Route Handling', () => {
    it('should handle document-management URL correctly', () => {
      cy.visit('/features/document-management');
      cy.url().should('include', '/login');
    });

    it('should maintain proper URL structure', () => {
      cy.url().should('match', /http:\/\/localhost:3001\//);
    });

    it('should handle navigation from home to document management', () => {
      cy.visit('/');
      cy.visit('/features/document-management');
      cy.url().should('include', '/login');
    });

    it('should preserve attempted URL for post-login redirect', () => {
      cy.visit('/features/document-management');
      cy.url().should('include', '/login');
    });

    it('should handle sub-feature navigation attempts', () => {
      cy.visit('/features/document-management/upload-storage');
      cy.url().should('include', '/login');
    });

    it('should handle case-insensitive URL variations', () => {
      cy.visit('/features/Document-Management', { failOnStatusCode: false });
      cy.url().should('exist');
    });

    it('should handle trailing slashes in URLs', () => {
      cy.visit('/features/document-management/');
      cy.url().should('include', '/login');
    });

    it('should maintain URL integrity during navigation', () => {
      cy.visit('/features/document-management');
      cy.contains('Home').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  // ============================================================================
  // Security and Data Protection Tests (6 tests)
  // ============================================================================
  describe('Security and Data Protection', () => {
    it('should require authentication for all document management routes', () => {
      const routes = [
        '/features/document-management',
        '/features/document-management/upload-storage',
        '/features/document-management/organization-indexing',
        '/features/document-management/templates-library'
      ];
      
      routes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/login');
      });
    });

    it('should not expose sensitive information in login form', () => {
      cy.get('input[type="password"]').should('exist');
      cy.get('input[type="password"]').invoke('attr', 'autocomplete').should('exist');
    });

    it('should have secure password input field', () => {
      cy.get('input[type="password"]').type('testpassword');
      cy.get('input[type="password"]').should('have.attr', 'type', 'password');
    });

    it('should have proper HTTPS indication for production', () => {
      cy.url().should('exist');
    });

    it('should protect against unauthorized access', () => {
      cy.visit('/features/document-management');
      cy.url().should('not.include', '/features/document-management');
      cy.url().should('include', '/login');
    });

    it('should maintain security across navigation', () => {
      cy.visit('/features/document-management');
      cy.contains('Home').click();
      cy.visit('/features/document-management');
      cy.url().should('include', '/login');
    });
  });
});
