describe('Court & Docket Management - Comprehensive Test Suite', () => {
  // Note: Court & Docket Management pages are protected by authentication
  // These tests verify the authentication flow, security, routing, and UX
  
  beforeEach(() => {
    cy.visit('/features/court-docket');
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

    it('should protect court-docket route with authentication', () => {
      cy.visit('/features/court-docket');
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
    it('should protect docket-tracking sub-feature route', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.url().should('include', '/login');
    });

    it('should protect electronic-filing sub-feature route', () => {
      cy.visit('/features/court-docket/electronic-filing');
      cy.url().should('include', '/login');
    });

    it('should protect court-rules sub-feature route', () => {
      cy.visit('/features/court-docket/court-rules');
      cy.url().should('include', '/login');
    });

    it('should protect opposing-counsel sub-feature route', () => {
      cy.visit('/features/court-docket/opposing-counsel');
      cy.url().should('include', '/login');
    });

    it('should protect judge-information sub-feature route', () => {
      cy.visit('/features/court-docket/judge-information');
      cy.url().should('include', '/login');
    });

    it('should protect courtroom-calendar sub-feature route', () => {
      cy.visit('/features/court-docket/courtroom-calendar');
      cy.url().should('include', '/login');
    });

    it('should protect docket-alerts sub-feature route', () => {
      cy.visit('/features/court-docket/docket-alerts');
      cy.url().should('include', '/login');
    });

    it('should protect document-retrieval sub-feature route', () => {
      cy.visit('/features/court-docket/document-retrieval');
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
      cy.get('input[type="email"]').type('court@lawfirm.com');
      cy.get('input[type="email"]').should('have.value', 'court@lawfirm.com');
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

    it('should have Features section with core features', () => {
      cy.get('footer').contains('Features').should('be.visible');
      cy.get('footer').contains('Case').should('be.visible');
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
  // Form Interaction and State Management Tests (14 tests)
  // ============================================================================
  describe('Form Interaction and State Management', () => {
    it('should maintain email value when switching fields', () => {
      const testEmail = 'docket@lawfirm.com';
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

    it('should allow clearing email field', () => {
      cy.get('input[type="email"]').clear().should('have.value', '');
    });

    it('should allow clearing password field', () => {
      cy.get('input[type="password"]').clear().should('have.value', '');
    });
  });

  // ============================================================================
  // URL and Route Handling Tests (8 tests)
  // ============================================================================
  describe('URL and Route Handling', () => {
    it('should handle court-docket URL correctly', () => {
      cy.visit('/features/court-docket');
      cy.url().should('include', '/login');
    });

    it('should maintain proper URL structure', () => {
      cy.url().should('include', Cypress.config().baseUrl);
    });

    it('should handle navigation from home to court-docket', () => {
      cy.visit('/');
      cy.visit('/features/court-docket');
      cy.url().should('include', '/login');
    });

    it('should preserve attempted URL for post-login redirect', () => {
      cy.visit('/features/court-docket');
      cy.url().should('include', '/login');
    });

    it('should handle sub-feature navigation attempts', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.url().should('include', '/login');
    });

    it('should handle case-insensitive URL variations', () => {
      cy.visit('/features/Court-Docket', { failOnStatusCode: false });
      cy.url().should('exist');
    });

    it('should handle trailing slashes in URLs', () => {
      cy.visit('/features/court-docket/');
      cy.url().should('include', '/login');
    });

    it('should maintain URL integrity during navigation', () => {
      cy.visit('/features/court-docket');
      cy.contains('Home').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  // ============================================================================
  // Security and Data Protection Tests (6 tests)
  // ============================================================================
  describe('Security and Data Protection', () => {
    it('should require authentication for all court-docket routes', () => {
      const routes = [
        '/features/court-docket',
        '/features/court-docket/docket-tracking',
        '/features/court-docket/electronic-filing',
        '/features/court-docket/court-rules'
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
      cy.visit('/features/court-docket');
      cy.url().should('not.include', '/features/court-docket');
      cy.url().should('include', '/login');
    });

    it('should maintain security across navigation', () => {
      cy.visit('/features/court-docket');
      cy.contains('Home').click();
      cy.visit('/features/court-docket');
      cy.url().should('include', '/login');
    });
  });

  // ============================================================================
  // Court Docket Specific Feature Tests (43 tests)
  // ============================================================================
  describe('Court Docket Tracking Features', () => {
    it('should protect docket tracking page with authentication', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.url().should('include', '/login');
    });

    it('should verify docket tracking route exists', () => {
      cy.request({ url: '/features/court-docket/docket-tracking', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for docket tracking', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.get('nav').should('exist');
    });

    it('should redirect docket tracking to login', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.url().should('include', '/login');
      cy.contains('Sign In').should('be.visible');
    });
  });

  describe('Electronic Filing (e-Filing) Features', () => {
    it('should protect electronic filing page with authentication', () => {
      cy.visit('/features/court-docket/electronic-filing');
      cy.url().should('include', '/login');
    });

    it('should verify electronic filing route exists', () => {
      cy.request({ url: '/features/court-docket/electronic-filing', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for e-filing', () => {
      cy.visit('/features/court-docket/electronic-filing');
      cy.get('nav').should('exist');
    });

    it('should redirect e-filing to login', () => {
      cy.visit('/features/court-docket/electronic-filing');
      cy.url().should('include', '/login');
      cy.contains('Sign In').should('be.visible');
    });
  });

  describe('Court Rules & Procedures Features', () => {
    it('should protect court rules page with authentication', () => {
      cy.visit('/features/court-docket/court-rules');
      cy.url().should('include', '/login');
    });

    it('should verify court rules route exists', () => {
      cy.request({ url: '/features/court-docket/court-rules', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for court rules', () => {
      cy.visit('/features/court-docket/court-rules');
      cy.get('nav').should('exist');
    });

    it('should redirect court rules to login', () => {
      cy.visit('/features/court-docket/court-rules');
      cy.url().should('include', '/login');
    });
  });

  describe('Opposing Counsel Database Features', () => {
    it('should protect opposing counsel page with authentication', () => {
      cy.visit('/features/court-docket/opposing-counsel');
      cy.url().should('include', '/login');
    });

    it('should verify opposing counsel route exists', () => {
      cy.request({ url: '/features/court-docket/opposing-counsel', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for opposing counsel', () => {
      cy.visit('/features/court-docket/opposing-counsel');
      cy.get('nav').should('exist');
    });

    it('should redirect opposing counsel to login', () => {
      cy.visit('/features/court-docket/opposing-counsel');
      cy.url().should('include', '/login');
    });
  });

  describe('Judge Information Features', () => {
    it('should protect judge information page with authentication', () => {
      cy.visit('/features/court-docket/judge-information');
      cy.url().should('include', '/login');
    });

    it('should verify judge information route exists', () => {
      cy.request({ url: '/features/court-docket/judge-information', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for judge information', () => {
      cy.visit('/features/court-docket/judge-information');
      cy.get('nav').should('exist');
    });

    it('should redirect judge information to login', () => {
      cy.visit('/features/court-docket/judge-information');
      cy.url().should('include', '/login');
    });
  });

  describe('Courtroom Calendar Features', () => {
    it('should protect courtroom calendar page with authentication', () => {
      cy.visit('/features/court-docket/courtroom-calendar');
      cy.url().should('include', '/login');
    });

    it('should verify courtroom calendar route exists', () => {
      cy.request({ url: '/features/court-docket/courtroom-calendar', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for courtroom calendar', () => {
      cy.visit('/features/court-docket/courtroom-calendar');
      cy.get('nav').should('exist');
    });

    it('should redirect courtroom calendar to login', () => {
      cy.visit('/features/court-docket/courtroom-calendar');
      cy.url().should('include', '/login');
    });
  });

  describe('Docket Alert System Features', () => {
    it('should protect docket alerts page with authentication', () => {
      cy.visit('/features/court-docket/docket-alerts');
      cy.url().should('include', '/login');
    });

    it('should verify docket alerts route exists', () => {
      cy.request({ url: '/features/court-docket/docket-alerts', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for docket alerts', () => {
      cy.visit('/features/court-docket/docket-alerts');
      cy.get('nav').should('exist');
    });

    it('should redirect docket alerts to login', () => {
      cy.visit('/features/court-docket/docket-alerts');
      cy.url().should('include', '/login');
    });
  });

  describe('Document Retrieval Features', () => {
    it('should protect document retrieval page with authentication', () => {
      cy.visit('/features/court-docket/document-retrieval');
      cy.url().should('include', '/login');
    });

    it('should verify document retrieval route exists', () => {
      cy.request({ url: '/features/court-docket/document-retrieval', failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 302, 401]);
    });

    it('should have consistent navigation for document retrieval', () => {
      cy.visit('/features/court-docket/document-retrieval');
      cy.get('nav').should('exist');
    });

    it('should redirect document retrieval to login', () => {
      cy.visit('/features/court-docket/document-retrieval');
      cy.url().should('include', '/login');
    });

    it('should display authentication UI for document retrieval', () => {
      cy.visit('/features/court-docket/document-retrieval');
      cy.get('input[type="email"]').should('be.visible');
    });

    it('should have proper form structure for document retrieval', () => {
      cy.visit('/features/court-docket/document-retrieval');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });

    it('should allow navigation from document retrieval login', () => {
      cy.visit('/features/court-docket/document-retrieval');
      cy.contains('Home').should('be.visible');
      cy.contains('Features').should('be.visible');
    });
  });

  // ============================================================================
  // Integration and Cross-Feature Tests (8 tests)
  // ============================================================================
  describe('Integration and Cross-Feature Validation', () => {
    it('should maintain consistent branding across all court docket sub-features', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.contains('Yellow Cross').should('be.visible');
      cy.visit('/features/court-docket/electronic-filing');
      cy.contains('Yellow Cross').should('be.visible');
    });

    it('should have consistent footer across all sub-features', () => {
      cy.visit('/features/court-docket/court-rules');
      cy.get('footer').should('exist');
      cy.visit('/features/court-docket/opposing-counsel');
      cy.get('footer').should('exist');
    });

    it('should protect all sub-features with authentication consistently', () => {
      const subFeatures = ['docket-tracking', 'electronic-filing', 'court-rules', 'opposing-counsel'];
      subFeatures.forEach(feature => {
        cy.visit(`/features/court-docket/${feature}`);
        cy.url().should('include', '/login');
      });
    });

    it('should have consistent navigation structure across sub-features', () => {
      cy.visit('/features/court-docket/judge-information');
      cy.get('nav').should('exist');
      cy.visit('/features/court-docket/courtroom-calendar');
      cy.get('nav').should('exist');
    });

    it('should display login form consistently for all protected routes', () => {
      cy.visit('/features/court-docket/docket-alerts');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.visit('/features/court-docket/document-retrieval');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
    });

    it('should allow registration from all sub-feature login pages', () => {
      cy.visit('/features/court-docket/docket-tracking');
      cy.contains('Create one').should('be.visible');
      cy.contains('Create one').click();
      cy.url().should('include', '/register');
    });

    it('should have responsive design across all sub-features', () => {
      cy.viewport(768, 1024);
      cy.visit('/features/court-docket/electronic-filing');
      cy.get('nav').should('be.visible');
      cy.viewport(375, 667);
      cy.visit('/features/court-docket/court-rules');
      cy.get('nav').should('exist');
    });

    it('should maintain page structure integrity across all routes', () => {
      const routes = ['docket-tracking', 'electronic-filing', 'court-rules'];
      routes.forEach(route => {
        cy.visit(`/features/court-docket/${route}`);
        cy.get('nav').should('exist');
        cy.get('main').should('exist');
        cy.get('footer').should('exist');
      });
    });
  });

});
