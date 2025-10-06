describe('Communication Page', () => {
  beforeEach(() => {
    cy.visit('/features/communication');
  });

  it('should load the communication page successfully', () => {
    cy.get('.feature-page').should('exist');
    cy.contains('Communication').should('exist');
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

  it('should display CTA section', () => {
    cy.get('.feature-cta').should('exist');
  });
});
