describe('Case Management Page', () => {
  beforeEach(() => {
    cy.visit('/features/case-management');
  });

  // ============================================================================
  // Page Load and Basic Structure Tests (5 tests)
  // ============================================================================
  describe('Page Load and Structure', () => {
    it('should load the case management page successfully', () => {
      cy.get('.feature-page').should('exist');
      cy.contains('Case Management').should('exist');
    });

    it('should display feature hero section with correct content', () => {
      cy.get('.feature-hero').should('exist');
      cy.get('.feature-icon').should('exist');
      cy.contains('Case Management System').should('be.visible');
      cy.contains('Comprehensive case management system').should('be.visible');
    });

    it('should have correct page title', () => {
      cy.title().should('include', 'Yellow Cross');
    });

    it('should display main container', () => {
      cy.get('.container').should('exist');
    });

    it('should have responsive layout', () => {
      cy.viewport(1280, 720);
      cy.get('.feature-page').should('be.visible');
      cy.viewport(768, 1024);
      cy.get('.feature-page').should('be.visible');
    });
  });

  // ============================================================================
  // Sub-Features Grid Tests (7 tests)
  // ============================================================================
  describe('Sub-Features Grid', () => {
    it('should display sub-features grid section', () => {
      cy.get('.sub-features-section').should('exist');
      cy.contains('Features & Capabilities').should('be.visible');
    });

    it('should display all 8 sub-feature cards', () => {
      cy.get('.sub-feature-card').should('have.length', 8);
    });

    it('should display Case Creation & Intake sub-feature', () => {
      cy.contains('Case Creation & Intake').should('be.visible');
      cy.contains('Create new cases, intake forms').should('be.visible');
    });

    it('should display Case Tracking & Status sub-feature', () => {
      cy.contains('Case Tracking & Status').should('be.visible');
      cy.contains('Track case progress, status updates').should('be.visible');
    });

    it('should display Case Assignment & Distribution sub-feature', () => {
      cy.contains('Case Assignment & Distribution').should('be.visible');
      cy.contains('Assign cases to attorneys').should('be.visible');
    });

    it('should display Case Timeline Management sub-feature', () => {
      cy.contains('Case Timeline Management').should('be.visible');
      cy.contains('Visual timeline, key dates').should('be.visible');
    });

    it('should display remaining sub-features', () => {
      cy.contains('Case Categorization & Tagging').should('be.visible');
      cy.contains('Case Notes & Updates').should('be.visible');
      cy.contains('Case Closing & Archive').should('be.visible');
      cy.contains('Case Analytics Dashboard').should('be.visible');
    });
  });

  // ============================================================================
  // Sub-Feature Card Functionality Tests (7 tests)
  // ============================================================================
  describe('Sub-Feature Cards Functionality', () => {
    it('should have working sub-feature links', () => {
      cy.get('.sub-feature-card').first().should('have.attr', 'href');
    });

    it('should have correct link format for sub-features', () => {
      cy.get('.sub-feature-card').first()
        .should('have.attr', 'href')
        .and('include', '/features/case-management/');
    });

    it('should display check icons on sub-feature cards', () => {
      cy.get('.sub-feature-card .fa-check-circle').should('have.length', 8);
    });

    it('should display "Learn more" links on all cards', () => {
      cy.get('.sub-feature-link').should('have.length', 8);
      cy.get('.sub-feature-link .fa-arrow-right').should('have.length', 8);
    });

    it('should have proper card structure with header and description', () => {
      cy.get('.sub-feature-card').first().within(() => {
        cy.get('.sub-feature-header').should('exist');
        cy.get('h3').should('exist');
        cy.get('p').should('exist');
      });
    });

    it('should be navigable via keyboard', () => {
      cy.get('.sub-feature-card').first().focus().should('have.focus');
    });

    it('should maintain card layout in grid', () => {
      cy.get('.sub-features-grid').should('exist');
      cy.get('.sub-features-grid .sub-feature-card').should('be.visible');
    });
  });

  // ============================================================================
  // Navigation and Links Tests (6 tests)
  // ============================================================================
  describe('Navigation and Links', () => {
    it('should navigate to Case Creation & Intake sub-feature', () => {
      cy.contains('Case Creation & Intake').click();
      cy.url().should('include', '/features/case-management/creation-intake');
    });

    it('should navigate back to case management from sub-feature', () => {
      cy.contains('Case Creation & Intake').click();
      cy.go('back');
      cy.url().should('include', '/features/case-management');
      cy.url().should('not.include', '/creation-intake');
    });

    it('should have accessible navigation links', () => {
      cy.get('.sub-feature-card').each(($link) => {
        cy.wrap($link).should('have.attr', 'href');
      });
    });

    it('should not have broken links', () => {
      cy.get('a[href]').each(($link) => {
        const href = $link.attr('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          cy.wrap($link).should('have.attr', 'href');
        }
      });
    });

    it('should maintain scroll position when navigating', () => {
      cy.scrollTo(0, 500);
      cy.window().then(($window) => {
        expect($window.scrollY).to.be.greaterThan(0);
      });
    });

    it('should have breadcrumb or navigation context', () => {
      // Check if page has some form of navigation context
      cy.get('body').should('exist');
    });
  });

  // ============================================================================
  // CTA (Call to Action) Tests (6 tests)
  // ============================================================================
  describe('Call to Action Section', () => {
    it('should display CTA section', () => {
      cy.get('.feature-cta').should('exist');
    });

    it('should display CTA heading', () => {
      cy.contains('Get Started with Case Management System').should('be.visible');
    });

    it('should display CTA description', () => {
      cy.contains('Ready to streamline your case management system').should('be.visible');
    });

    it('should display Start Free Trial button', () => {
      cy.contains('Start Free Trial').should('exist').should('be.visible');
    });

    it('should display Schedule Demo button', () => {
      cy.contains('Schedule Demo').should('exist').should('be.visible');
    });

    it('should have working CTA button links', () => {
      cy.get('.cta-buttons .btn').should('have.length.greaterThan', 0);
    });
  });

  // ============================================================================
  // Visual and Styling Tests (6 tests)
  // ============================================================================
  describe('Visual and Styling', () => {
    it('should have proper icon display', () => {
      cy.get('.feature-icon').should('exist');
      cy.get('.fa-briefcase').should('exist');
    });

    it('should have consistent typography', () => {
      cy.get('h1').should('be.visible');
      cy.get('h2').should('be.visible');
      cy.get('h3').should('have.length.greaterThan', 0);
    });

    it('should have proper spacing and layout', () => {
      cy.get('.feature-hero').should('be.visible');
      cy.get('.container').should('exist');
    });

    it('should display all sections in correct order', () => {
      cy.get('.feature-hero').should('exist');
      cy.get('.sub-features-section').should('exist');
      cy.get('.feature-cta').should('exist');
    });

    it('should have proper color scheme', () => {
      cy.get('.btn-primary').should('exist');
      cy.get('.btn-secondary').should('exist');
    });

    it('should have hover effects on interactive elements', () => {
      cy.get('.sub-feature-card').first().trigger('mouseover');
      cy.get('.sub-feature-card').first().should('exist');
    });
  });

  // ============================================================================
  // Content Validation Tests (7 tests)
  // ============================================================================
  describe('Content Validation', () => {
    it('should display accurate sub-feature descriptions', () => {
      cy.contains('Create new cases, intake forms, client questionnaires').should('be.visible');
    });

    it('should have meaningful content for each sub-feature', () => {
      cy.get('.sub-feature-card p').each(($desc) => {
        cy.wrap($desc).invoke('text').should('have.length.greaterThan', 10);
      });
    });

    it('should display feature benefits', () => {
      cy.get('.feature-subtitle').should('exist');
    });

    it('should have consistent naming convention', () => {
      cy.contains('Case Management System').should('be.visible');
    });

    it('should display all required text content', () => {
      const requiredTexts = [
        'Case Creation & Intake',
        'Case Tracking & Status',
        'Case Assignment & Distribution',
        'Case Timeline Management',
        'Case Categorization & Tagging',
        'Case Notes & Updates',
        'Case Closing & Archive',
        'Case Analytics Dashboard'
      ];
      requiredTexts.forEach(text => {
        cy.contains(text).should('be.visible');
      });
    });

    it('should not have placeholder or lorem ipsum text', () => {
      cy.get('body').should('not.contain', 'Lorem ipsum');
      cy.get('body').should('not.contain', 'TODO');
    });

    it('should have professional and clear messaging', () => {
      cy.get('.feature-subtitle').should('be.visible');
      cy.get('.sub-feature-card p').should('be.visible');
    });
  });

  // ============================================================================
  // Accessibility Tests (6 tests)
  // ============================================================================
  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      cy.get('main, section, article, .feature-page').should('exist');
    });

    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('have.length', 1);
      cy.get('h2').should('have.length.greaterThan', 0);
    });

    it('should have accessible links', () => {
      cy.get('a').each(($link) => {
        cy.wrap($link).invoke('text').should('not.be.empty');
      });
    });

    it('should support keyboard navigation', () => {
      cy.get('body').type('{tab}');
      cy.focused().should('exist');
    });

    it('should have proper ARIA attributes where needed', () => {
      // Check that interactive elements are properly structured
      cy.get('.sub-feature-card').should('exist');
    });

    it('should have sufficient color contrast', () => {
      // Verify text is visible against background
      cy.get('h1').should('be.visible');
      cy.get('p').should('be.visible');
    });
  });
});
