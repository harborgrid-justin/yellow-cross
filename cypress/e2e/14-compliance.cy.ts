describe('Compliance Page', () => {
  beforeEach(() => {
    cy.visit('/features/compliance');
  });

  it('should load the compliance page successfully', () => {
    cy.get('.feature-page').should('exist');
    cy.contains('Compliance').should('exist');
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
