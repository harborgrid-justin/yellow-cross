describe('Legal Research Page', () => {
  beforeEach(() => {
    cy.visit('/features/legal-research');
  });

  it('should load the legal research page successfully', () => {
    cy.contains('Legal Research & Knowledge Base').should('be.visible');
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
