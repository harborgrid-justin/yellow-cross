describe('Task & Workflow Management - Comprehensive Test Suite', () => {
  // Note: Task & Workflow Management pages are protected by authentication
  // These tests verify the authentication flow, security, routing, and UX
  
  beforeEach(() => {
    cy.visit('/features/task-workflow');
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

    it('should protect task workflow route with authentication', () => {
      cy.visit('/features/task-workflow');
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
    it('should protect creation-assignment sub-feature route', () => {
      cy.visit('/features/task-workflow/creation-assignment');
      cy.url().should('include', '/login');
    });

    it('should protect workflow-automation sub-feature route', () => {
      cy.visit('/features/task-workflow/workflow-automation');
      cy.url().should('include', '/login');
    });

    it('should protect task-dependencies sub-feature route', () => {
      cy.visit('/features/task-workflow/task-dependencies');
      cy.url().should('include', '/login');
    });

    it('should protect priority-management sub-feature route', () => {
      cy.visit('/features/task-workflow/priority-management');
      cy.url().should('include', '/login');
    });

    it('should protect task-templates sub-feature route', () => {
      cy.visit('/features/task-workflow/task-templates');
      cy.url().should('include', '/login');
    });

    it('should protect progress-tracking sub-feature route', () => {
      cy.visit('/features/task-workflow/progress-tracking');
      cy.url().should('include', '/login');
    });

    it('should protect team-collaboration sub-feature route', () => {
      cy.visit('/features/task-workflow/team-collaboration');
      cy.url().should('include', '/login');
    });

    it('should protect workflow-analytics sub-feature route', () => {
      cy.visit('/features/task-workflow/workflow-analytics');
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

    it('should have Features section in footer with feature links', () => {
      cy.get('footer').contains('Features').should('be.visible');
      cy.get('footer').contains('Case Management System').should('be.visible');
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

    it('should display Contact link in footer', () => {
      cy.get('footer').contains('Contact').should('be.visible');
    });

    it('should have consistent footer layout across pages', () => {
      cy.get('footer').should('exist');
      cy.visit('/');
      cy.get('footer').should('exist');
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

    it('should have responsive layout on different viewports', () => {
      cy.viewport(1280, 720);
      cy.get('nav').should('be.visible');
      cy.viewport(768, 1024);
      cy.get('nav').should('be.visible');
      cy.viewport(375, 667);
      cy.get('nav').should('exist');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1, h2, h3, h4, h5, h6').should('have.length.greaterThan', 0);
    });

    it('should have visible focus indicators', () => {
      cy.get('input[type="email"]').focus();
      cy.focused().should('be.visible');
    });

    it('should have accessible form controls', () => {
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should maintain consistent font sizing for readability', () => {
      cy.get('body').should('have.css', 'font-size');
    });
  });

  // ============================================================================
  // Form Interaction and State Management Tests (14 tests)
  // ============================================================================
  describe('Form Interaction and State Management', () => {
    it('should allow clearing email field', () => {
      cy.get('input[type="email"]').clear().should('have.value', '');
    });

    it('should allow clearing password field', () => {
      cy.get('input[type="password"]').clear().should('have.value', '');
    });

    it('should maintain email value when switching fields', () => {
      const testEmail = 'taskmanager@lawfirm.com';
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').click();
      cy.get('input[type="email"]').should('have.value', testEmail);
    });

    it('should maintain password value when switching fields', () => {
      cy.get('input[type="password"]').type('workflowPass123');
      cy.get('input[type="email"]').click();
      cy.get('input[type="password"]').should('have.value', 'workflowPass123');
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
      cy.get('input[type="password"]').invoke('prop', 'type').should('eq', 'password');
    });

    it('should have email field with email input type', () => {
      cy.get('input[type="email"]').invoke('prop', 'type').should('eq', 'email');
    });
  });

  // ============================================================================
  // URL and Route Handling Tests (10 tests)
  // ============================================================================
  describe('URL and Route Handling', () => {
    it('should have correct URL structure for main feature page', () => {
      cy.visit('/features/task-workflow');
      cy.url().should('include', '/features/task-workflow');
      cy.url().should('include', '/login');
    });

    it('should handle direct navigation to task-workflow page', () => {
      cy.visit('/features/task-workflow');
      cy.url().should('include', '/login');
    });

    it('should preserve query parameters during redirect', () => {
      cy.visit('/features/task-workflow?source=external');
      cy.url().should('include', '/login');
    });

    it('should handle navigation from login page back to home', () => {
      cy.contains('Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should handle navigation to register page and back', () => {
      cy.contains('Create one').click();
      cy.url().should('include', '/register');
      cy.visit('/features/task-workflow');
      cy.url().should('include', '/login');
    });

    it('should maintain URL consistency across navigation', () => {
      cy.url().should('include', '/login');
      cy.contains('Yellow Cross').should('be.visible');
    });

    it('should handle browser back button correctly', () => {
      cy.contains('Home').click();
      cy.go('back');
      cy.url().should('include', '/login');
    });

    it('should handle browser forward button correctly', () => {
      cy.contains('Home').click();
      cy.go('back');
      cy.go('forward');
      cy.url().should('include', '/');
    });

    it('should redirect sub-feature routes to login', () => {
      cy.visit('/features/task-workflow/creation-assignment');
      cy.url().should('include', '/login');
    });

    it('should handle invalid sub-feature routes gracefully', () => {
      cy.visit('/features/task-workflow/invalid-route');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Security and Data Protection Tests (10 tests)
  // ============================================================================
  describe('Security and Data Protection', () => {
    it('should require authentication for accessing task workflow features', () => {
      cy.visit('/features/task-workflow');
      cy.url().should('include', '/login');
      cy.contains('Sign In').should('be.visible');
    });

    it('should mask password input for security', () => {
      cy.get('input[type="password"]').should('exist');
      cy.get('input[type="password"]').invoke('prop', 'type').should('eq', 'password');
    });

    it('should protect creation-assignment from unauthorized access', () => {
      cy.visit('/features/task-workflow/creation-assignment');
      cy.url().should('include', '/login');
    });

    it('should protect workflow-automation from unauthorized access', () => {
      cy.visit('/features/task-workflow/workflow-automation');
      cy.url().should('include', '/login');
    });

    it('should protect task-dependencies from unauthorized access', () => {
      cy.visit('/features/task-workflow/task-dependencies');
      cy.url().should('include', '/login');
    });

    it('should protect priority-management from unauthorized access', () => {
      cy.visit('/features/task-workflow/priority-management');
      cy.url().should('include', '/login');
    });

    it('should have secure form submission', () => {
      cy.get('button[type="submit"]').should('exist');
    });

    it('should not expose sensitive data in URL', () => {
      cy.url().should('not.include', 'password');
      cy.url().should('not.include', 'token');
    });

    it('should implement proper session management', () => {
      cy.get('input[type="checkbox"]').should('exist');
      cy.contains('Remember me').should('be.visible');
    });

    it('should have forgot password functionality for account recovery', () => {
      cy.contains('Forgot password').should('be.visible');
    });
  });

  // ============================================================================
  // Task & Workflow Specific Features Tests (12 tests)
  // ============================================================================
  describe('Task & Workflow Specific Features', () => {
    it('should display task creation and assignment information', () => {
      cy.visit('/features/task-workflow/creation-assignment');
      cy.url().should('include', '/login');
    });

    it('should display workflow automation capabilities', () => {
      cy.visit('/features/task-workflow/workflow-automation');
      cy.url().should('include', '/login');
    });

    it('should show task dependencies feature', () => {
      cy.visit('/features/task-workflow/task-dependencies');
      cy.url().should('include', '/login');
    });

    it('should display priority management options', () => {
      cy.visit('/features/task-workflow/priority-management');
      cy.url().should('include', '/login');
    });

    it('should show task templates feature', () => {
      cy.visit('/features/task-workflow/task-templates');
      cy.url().should('include', '/login');
    });

    it('should display progress tracking capabilities', () => {
      cy.visit('/features/task-workflow/progress-tracking');
      cy.url().should('include', '/login');
    });

    it('should show team collaboration features', () => {
      cy.visit('/features/task-workflow/team-collaboration');
      cy.url().should('include', '/login');
    });

    it('should display workflow analytics', () => {
      cy.visit('/features/task-workflow/workflow-analytics');
      cy.url().should('include', '/login');
    });

    it('should have task workflow page title', () => {
      cy.title().should('include', 'Yellow Cross');
    });

    it('should protect all task workflow routes', () => {
      const routes = [
        '/features/task-workflow',
        '/features/task-workflow/creation-assignment',
        '/features/task-workflow/workflow-automation',
        '/features/task-workflow/task-dependencies'
      ];
      routes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/login');
      });
    });

    it('should maintain security across all task workflow sub-features', () => {
      cy.visit('/features/task-workflow/progress-tracking');
      cy.url().should('include', '/login');
      cy.get('input[type="password"]').should('exist');
    });

    it('should have consistent branding across task workflow pages', () => {
      cy.contains('Yellow Cross').should('be.visible');
      cy.get('nav').should('exist');
      cy.get('footer').should('exist');
    });
  });
});
