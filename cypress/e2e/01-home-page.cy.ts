describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page successfully', () => {
    cy.contains('Enterprise Law Firm Practice Management').should('be.visible');
  });

  it('should display hero section with stats', () => {
    cy.get('.hero').should('exist');
    cy.contains('15').should('be.visible');
    cy.contains('Core Features').should('be.visible');
    cy.contains('120').should('be.visible');
    cy.contains('Sub-Features').should('be.visible');
  });

  it('should display features grid', () => {
    cy.get('.features-grid').should('exist');
    cy.get('.feature-card').should('have.length.greaterThan', 0);
  });

  it('should have working navigation links', () => {
    cy.contains('Get Started Free').should('have.attr', 'href');
    cy.contains('Explore Features').should('have.attr', 'href');
  });

  it('should display CTA section', () => {
    cy.get('.cta-section').should('exist');
    cy.contains('Ready to Transform Your Practice?').should('be.visible');
  });
});
