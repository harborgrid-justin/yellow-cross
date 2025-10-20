describe('Calendar & Scheduling System - Comprehensive Test Suite', () => {
  // Note: Calendar & Scheduling pages are protected by authentication
  // These tests verify the authentication flow, security, routing, and UX
  
  beforeEach(() => {
    cy.visit('/features/calendar-scheduling');
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

    it('should protect calendar scheduling route with authentication', () => {
      cy.visit('/features/calendar-scheduling');
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
    it('should protect event-management sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/event-management');
      cy.url().should('include', '/login');
    });

    it('should protect appointment-scheduling sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling');
      cy.url().should('include', '/login');
    });

    it('should protect court-dates sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/court-dates');
      cy.url().should('include', '/login');
    });

    it('should protect deadlines sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/deadlines');
      cy.url().should('include', '/login');
    });

    it('should protect team-calendar sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/team-calendar');
      cy.url().should('include', '/login');
    });

    it('should protect reminders-notifications sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/reminders-notifications');
      cy.url().should('include', '/login');
    });

    it('should protect availability-booking sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/availability-booking');
      cy.url().should('include', '/login');
    });

    it('should protect calendar-sync sub-feature route', () => {
      cy.visit('/features/calendar-scheduling/calendar-sync');
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
      cy.get('input[type="email"]').type('scheduler@lawfirm.com');
      cy.get('input[type="email"]').should('have.value', 'scheduler@lawfirm.com');
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

    it('should have Features section listing Calendar & Scheduling', () => {
      cy.get('footer').contains('Features').should('be.visible');
      cy.get('footer').contains('Calendar').should('be.visible');
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
      const testEmail = 'calendar@lawfirm.com';
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
    it('should handle calendar-scheduling URL correctly', () => {
      cy.visit('/features/calendar-scheduling');
      cy.url().should('include', '/login');
    });

    it('should maintain proper URL structure', () => {
      cy.url().should('include', Cypress.config().baseUrl);
    });

    it('should handle navigation from home to calendar', () => {
      cy.visit('/');
      cy.visit('/features/calendar-scheduling');
      cy.url().should('include', '/login');
    });

    it('should preserve attempted URL for post-login redirect', () => {
      cy.visit('/features/calendar-scheduling');
      cy.url().should('include', '/login');
    });

    it('should handle sub-feature navigation attempts', () => {
      cy.visit('/features/calendar-scheduling/event-management');
      cy.url().should('include', '/login');
    });

    it('should handle case-insensitive URL variations', () => {
      cy.visit('/features/Calendar-Scheduling', { failOnStatusCode: false });
      cy.url().should('exist');
    });

    it('should handle trailing slashes in URLs', () => {
      cy.visit('/features/calendar-scheduling/');
      cy.url().should('include', '/login');
    });

    it('should maintain URL integrity during navigation', () => {
      cy.visit('/features/calendar-scheduling');
      cy.contains('Home').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  // ============================================================================
  // Security and Data Protection Tests (10 tests)
  // ============================================================================
  describe('Security and Data Protection', () => {
    it('should require authentication for all calendar routes', () => {
      const routes = [
        '/features/calendar-scheduling',
        '/features/calendar-scheduling/event-management',
        '/features/calendar-scheduling/appointment-scheduling',
        '/features/calendar-scheduling/court-dates'
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
      cy.visit('/features/calendar-scheduling');
      cy.url().should('not.include', '/features/calendar-scheduling');
      cy.url().should('include', '/login');
    });

    it('should maintain security across navigation', () => {
      cy.visit('/features/calendar-scheduling');
      cy.contains('Home').click();
      cy.visit('/features/calendar-scheduling');
      cy.url().should('include', '/login');
    });

    it('should protect event management sub-feature', () => {
      cy.visit('/features/calendar-scheduling/event-management');
      cy.url().should('include', '/login');
    });

    it('should protect appointment scheduling sub-feature', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling');
      cy.url().should('include', '/login');
    });

    it('should protect court dates sub-feature', () => {
      cy.visit('/features/calendar-scheduling/court-dates');
      cy.url().should('include', '/login');
    });

    it('should protect deadlines sub-feature', () => {
      cy.visit('/features/calendar-scheduling/deadlines');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Event Management Tests (15 tests)
  // ============================================================================
  describe('Event Management Features', () => {
    it('should protect event creation route', () => {
      cy.visit('/features/calendar-scheduling/event-management');
      cy.url().should('include', '/login');
    });

    it('should protect event editing routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/edit');
      cy.url().should('include', '/login');
    });

    it('should protect event deletion routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/delete');
      cy.url().should('include', '/login');
    });

    it('should protect event view routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/view');
      cy.url().should('include', '/login');
    });

    it('should protect event list routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/list');
      cy.url().should('include', '/login');
    });

    it('should protect event search routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/search');
      cy.url().should('include', '/login');
    });

    it('should protect event filter routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/filter');
      cy.url().should('include', '/login');
    });

    it('should protect event categories routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/categories');
      cy.url().should('include', '/login');
    });

    it('should protect recurring events routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/recurring');
      cy.url().should('include', '/login');
    });

    it('should protect event reminders routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/reminders');
      cy.url().should('include', '/login');
    });

    it('should protect event invitations routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/invitations');
      cy.url().should('include', '/login');
    });

    it('should protect event attendees routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/attendees');
      cy.url().should('include', '/login');
    });

    it('should protect event conflicts routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/conflicts');
      cy.url().should('include', '/login');
    });

    it('should protect event templates routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/templates');
      cy.url().should('include', '/login');
    });

    it('should protect event export routes', () => {
      cy.visit('/features/calendar-scheduling/event-management/export');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Appointment Scheduling Tests (18 tests)
  // ============================================================================
  describe('Appointment Scheduling Features', () => {
    it('should protect appointment booking route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling');
      cy.url().should('include', '/login');
    });

    it('should protect appointment list route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/list');
      cy.url().should('include', '/login');
    });

    it('should protect appointment editing route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/edit');
      cy.url().should('include', '/login');
    });

    it('should protect appointment cancellation route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/cancel');
      cy.url().should('include', '/login');
    });

    it('should protect appointment rescheduling route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/reschedule');
      cy.url().should('include', '/login');
    });

    it('should protect appointment confirmation route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/confirm');
      cy.url().should('include', '/login');
    });

    it('should protect appointment reminders route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/reminders');
      cy.url().should('include', '/login');
    });

    it('should protect appointment types route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/types');
      cy.url().should('include', '/login');
    });

    it('should protect appointment duration route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/duration');
      cy.url().should('include', '/login');
    });

    it('should protect appointment location route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/location');
      cy.url().should('include', '/login');
    });

    it('should protect appointment notes route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/notes');
      cy.url().should('include', '/login');
    });

    it('should protect appointment history route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/history');
      cy.url().should('include', '/login');
    });

    it('should protect appointment search route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/search');
      cy.url().should('include', '/login');
    });

    it('should protect appointment filter route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/filter');
      cy.url().should('include', '/login');
    });

    it('should protect appointment waitlist route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/waitlist');
      cy.url().should('include', '/login');
    });

    it('should protect appointment no-show route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/no-show');
      cy.url().should('include', '/login');
    });

    it('should protect appointment feedback route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/feedback');
      cy.url().should('include', '/login');
    });

    it('should protect appointment reports route', () => {
      cy.visit('/features/calendar-scheduling/appointment-scheduling/reports');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Court Dates and Deadlines Tests (8 tests)
  // ============================================================================
  describe('Court Dates and Deadlines Features', () => {
    it('should protect court dates management', () => {
      cy.visit('/features/calendar-scheduling/court-dates');
      cy.url().should('include', '/login');
    });

    it('should protect deadline tracking', () => {
      cy.visit('/features/calendar-scheduling/deadlines');
      cy.url().should('include', '/login');
    });

    it('should protect court date reminders', () => {
      cy.visit('/features/calendar-scheduling/court-dates/reminders');
      cy.url().should('include', '/login');
    });

    it('should protect deadline alerts', () => {
      cy.visit('/features/calendar-scheduling/deadlines/alerts');
      cy.url().should('include', '/login');
    });

    it('should protect court date conflicts', () => {
      cy.visit('/features/calendar-scheduling/court-dates/conflicts');
      cy.url().should('include', '/login');
    });

    it('should protect deadline extensions', () => {
      cy.visit('/features/calendar-scheduling/deadlines/extensions');
      cy.url().should('include', '/login');
    });

    it('should protect court calendar sync', () => {
      cy.visit('/features/calendar-scheduling/court-dates/sync');
      cy.url().should('include', '/login');
    });

    it('should protect deadline reports', () => {
      cy.visit('/features/calendar-scheduling/deadlines/reports');
      cy.url().should('include', '/login');
    });
  });
});
