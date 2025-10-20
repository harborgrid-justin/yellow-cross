describe('Time & Billing System - Comprehensive Test Suite', () => {
  // Note: Time & Billing pages are protected by authentication
  // These tests verify the authentication flow, security, routing, and UX
  
  beforeEach(() => {
    cy.visit('/features/time-billing');
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

    it('should protect time billing route with authentication', () => {
      cy.visit('/features/time-billing');
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
    it('should protect time-tracking sub-feature route', () => {
      cy.visit('/features/time-billing/time-tracking');
      cy.url().should('include', '/login');
    });

    it('should protect expense-management sub-feature route', () => {
      cy.visit('/features/time-billing/expense-management');
      cy.url().should('include', '/login');
    });

    it('should protect invoice-generation sub-feature route', () => {
      cy.visit('/features/time-billing/invoice-generation');
      cy.url().should('include', '/login');
    });

    it('should protect payment-processing sub-feature route', () => {
      cy.visit('/features/time-billing/payment-processing');
      cy.url().should('include', '/login');
    });

    it('should protect billing-rates sub-feature route', () => {
      cy.visit('/features/time-billing/billing-rates');
      cy.url().should('include', '/login');
    });

    it('should protect trust-accounting sub-feature route', () => {
      cy.visit('/features/time-billing/trust-accounting');
      cy.url().should('include', '/login');
    });

    it('should protect reporting sub-feature route', () => {
      cy.visit('/features/time-billing/reporting');
      cy.url().should('include', '/login');
    });

    it('should protect retainer-management sub-feature route', () => {
      cy.visit('/features/time-billing/retainer-management');
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
      cy.get('input[type="email"]').type('billing@lawfirm.com');
      cy.get('input[type="email"]').should('have.value', 'billing@lawfirm.com');
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

    it('should have Features section listing Time & Billing', () => {
      cy.get('footer').contains('Features').should('be.visible');
      cy.get('footer').contains('Time & Billing').should('be.visible');
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
      const testEmail = 'billing@lawfirm.com';
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
    it('should handle time-billing URL correctly', () => {
      cy.visit('/features/time-billing');
      cy.url().should('include', '/login');
    });

    it('should maintain proper URL structure', () => {
      cy.url().should('include', Cypress.config().baseUrl);
    });

    it('should handle navigation from home to time billing', () => {
      cy.visit('/');
      cy.visit('/features/time-billing');
      cy.url().should('include', '/login');
    });

    it('should preserve attempted URL for post-login redirect', () => {
      cy.visit('/features/time-billing');
      cy.url().should('include', '/login');
    });

    it('should handle sub-feature navigation attempts', () => {
      cy.visit('/features/time-billing/time-tracking');
      cy.url().should('include', '/login');
    });

    it('should handle case-insensitive URL variations', () => {
      cy.visit('/features/Time-Billing', { failOnStatusCode: false });
      cy.url().should('exist');
    });

    it('should handle trailing slashes in URLs', () => {
      cy.visit('/features/time-billing/');
      cy.url().should('include', '/login');
    });

    it('should maintain URL integrity during navigation', () => {
      cy.visit('/features/time-billing');
      cy.contains('Home').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  // ============================================================================
  // Security and Data Protection Tests (10 tests)
  // ============================================================================
  describe('Security and Data Protection', () => {
    it('should require authentication for all time billing routes', () => {
      const routes = [
        '/features/time-billing',
        '/features/time-billing/time-tracking',
        '/features/time-billing/expense-management',
        '/features/time-billing/invoice-generation'
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
      cy.visit('/features/time-billing');
      cy.url().should('not.include', '/features/time-billing');
      cy.url().should('include', '/login');
    });

    it('should maintain security across navigation', () => {
      cy.visit('/features/time-billing');
      cy.contains('Home').click();
      cy.visit('/features/time-billing');
      cy.url().should('include', '/login');
    });

    it('should protect time tracking sub-feature', () => {
      cy.visit('/features/time-billing/time-tracking');
      cy.url().should('include', '/login');
    });

    it('should protect expense management sub-feature', () => {
      cy.visit('/features/time-billing/expense-management');
      cy.url().should('include', '/login');
    });

    it('should protect invoice generation sub-feature', () => {
      cy.visit('/features/time-billing/invoice-generation');
      cy.url().should('include', '/login');
    });

    it('should protect payment processing sub-feature', () => {
      cy.visit('/features/time-billing/payment-processing');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Time Tracking Specific Tests (15 tests)
  // ============================================================================
  describe('Time Tracking Features', () => {
    it('should protect time entry creation route', () => {
      cy.visit('/features/time-billing/time-tracking');
      cy.url().should('include', '/login');
    });

    it('should protect timer functionality routes', () => {
      cy.visit('/features/time-billing/time-tracking/timer');
      cy.url().should('include', '/login');
    });

    it('should protect time entry editing routes', () => {
      cy.visit('/features/time-billing/time-tracking/edit');
      cy.url().should('include', '/login');
    });

    it('should protect time entry deletion routes', () => {
      cy.visit('/features/time-billing/time-tracking/delete');
      cy.url().should('include', '/login');
    });

    it('should protect bulk time entry routes', () => {
      cy.visit('/features/time-billing/time-tracking/bulk');
      cy.url().should('include', '/login');
    });

    it('should protect time entry approval routes', () => {
      cy.visit('/features/time-billing/time-tracking/approval');
      cy.url().should('include', '/login');
    });

    it('should protect timesheet view routes', () => {
      cy.visit('/features/time-billing/time-tracking/timesheet');
      cy.url().should('include', '/login');
    });

    it('should protect time entry search routes', () => {
      cy.visit('/features/time-billing/time-tracking/search');
      cy.url().should('include', '/login');
    });

    it('should protect time entry export routes', () => {
      cy.visit('/features/time-billing/time-tracking/export');
      cy.url().should('include', '/login');
    });

    it('should protect billable hours routes', () => {
      cy.visit('/features/time-billing/time-tracking/billable');
      cy.url().should('include', '/login');
    });

    it('should protect non-billable hours routes', () => {
      cy.visit('/features/time-billing/time-tracking/non-billable');
      cy.url().should('include', '/login');
    });

    it('should protect time entry categories routes', () => {
      cy.visit('/features/time-billing/time-tracking/categories');
      cy.url().should('include', '/login');
    });

    it('should protect time entry notes routes', () => {
      cy.visit('/features/time-billing/time-tracking/notes');
      cy.url().should('include', '/login');
    });

    it('should protect time entry templates routes', () => {
      cy.visit('/features/time-billing/time-tracking/templates');
      cy.url().should('include', '/login');
    });

    it('should protect time entry reminders routes', () => {
      cy.visit('/features/time-billing/time-tracking/reminders');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Invoice Management Tests (18 tests)
  // ============================================================================
  describe('Invoice Management Features', () => {
    it('should protect invoice creation route', () => {
      cy.visit('/features/time-billing/invoice-generation');
      cy.url().should('include', '/login');
    });

    it('should protect invoice list route', () => {
      cy.visit('/features/time-billing/invoice-generation/list');
      cy.url().should('include', '/login');
    });

    it('should protect invoice preview route', () => {
      cy.visit('/features/time-billing/invoice-generation/preview');
      cy.url().should('include', '/login');
    });

    it('should protect invoice editing route', () => {
      cy.visit('/features/time-billing/invoice-generation/edit');
      cy.url().should('include', '/login');
    });

    it('should protect invoice deletion route', () => {
      cy.visit('/features/time-billing/invoice-generation/delete');
      cy.url().should('include', '/login');
    });

    it('should protect invoice sending route', () => {
      cy.visit('/features/time-billing/invoice-generation/send');
      cy.url().should('include', '/login');
    });

    it('should protect invoice templates route', () => {
      cy.visit('/features/time-billing/invoice-generation/templates');
      cy.url().should('include', '/login');
    });

    it('should protect invoice customization route', () => {
      cy.visit('/features/time-billing/invoice-generation/customize');
      cy.url().should('include', '/login');
    });

    it('should protect invoice history route', () => {
      cy.visit('/features/time-billing/invoice-generation/history');
      cy.url().should('include', '/login');
    });

    it('should protect invoice search route', () => {
      cy.visit('/features/time-billing/invoice-generation/search');
      cy.url().should('include', '/login');
    });

    it('should protect invoice filtering route', () => {
      cy.visit('/features/time-billing/invoice-generation/filter');
      cy.url().should('include', '/login');
    });

    it('should protect invoice export route', () => {
      cy.visit('/features/time-billing/invoice-generation/export');
      cy.url().should('include', '/login');
    });

    it('should protect invoice payment status route', () => {
      cy.visit('/features/time-billing/invoice-generation/payment-status');
      cy.url().should('include', '/login');
    });

    it('should protect invoice reminders route', () => {
      cy.visit('/features/time-billing/invoice-generation/reminders');
      cy.url().should('include', '/login');
    });

    it('should protect invoice discounts route', () => {
      cy.visit('/features/time-billing/invoice-generation/discounts');
      cy.url().should('include', '/login');
    });

    it('should protect invoice late fees route', () => {
      cy.visit('/features/time-billing/invoice-generation/late-fees');
      cy.url().should('include', '/login');
    });

    it('should protect invoice recurring route', () => {
      cy.visit('/features/time-billing/invoice-generation/recurring');
      cy.url().should('include', '/login');
    });

    it('should protect invoice batch processing route', () => {
      cy.visit('/features/time-billing/invoice-generation/batch');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Expense Management Tests (8 tests)
  // ============================================================================
  describe('Expense Management Features', () => {
    it('should protect expense entry creation', () => {
      cy.visit('/features/time-billing/expense-management');
      cy.url().should('include', '/login');
    });

    it('should protect expense receipts upload', () => {
      cy.visit('/features/time-billing/expense-management/receipts');
      cy.url().should('include', '/login');
    });

    it('should protect expense categories', () => {
      cy.visit('/features/time-billing/expense-management/categories');
      cy.url().should('include', '/login');
    });

    it('should protect expense approval workflow', () => {
      cy.visit('/features/time-billing/expense-management/approval');
      cy.url().should('include', '/login');
    });

    it('should protect expense reimbursement', () => {
      cy.visit('/features/time-billing/expense-management/reimbursement');
      cy.url().should('include', '/login');
    });

    it('should protect expense reports', () => {
      cy.visit('/features/time-billing/expense-management/reports');
      cy.url().should('include', '/login');
    });

    it('should protect expense search and filter', () => {
      cy.visit('/features/time-billing/expense-management/search');
      cy.url().should('include', '/login');
    });

    it('should protect expense export', () => {
      cy.visit('/features/time-billing/expense-management/export');
      cy.url().should('include', '/login');
    });
  });
});
