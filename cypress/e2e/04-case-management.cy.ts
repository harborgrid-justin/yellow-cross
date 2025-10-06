describe('Case Management Page', () => {
  beforeEach(() => {
    cy.visit('/features/case-management');
  });

  it('should load the case management page successfully', () => {
    cy.contains('Case Management System').should('be.visible');
  });

  it('should display feature hero section', () => {
    cy.get('.feature-hero').should('exist');
    cy.get('.feature-icon').should('exist');
  });

  it('should display sub-features grid', () => {
    cy.get('.sub-features-grid').should('exist');
    cy.get('.sub-feature-card').should('have.length.greaterThan', 0);
  });

  it('should have working sub-feature links', () => {
    cy.get('.sub-feature-card').first().should('have.attr', 'href');
  });

  it('should display CTA buttons', () => {
    cy.contains('Start Free Trial').should('exist');
    cy.contains('Schedule Demo').should('exist');
  });
});
