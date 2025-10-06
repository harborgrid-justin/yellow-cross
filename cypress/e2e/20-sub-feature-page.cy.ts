describe('Sub-Feature Page', () => {
  beforeEach(() => {
    // Visit a sub-feature page (case intake example)
    cy.visit('/features/case-management/case-intake');
  });

  it('should load sub-feature page successfully', () => {
    cy.get('.sub-feature-page').should('exist');
  });

  it('should display sub-feature title', () => {
    cy.get('h1').should('be.visible');
  });

  it('should display sub-feature description', () => {
    cy.get('p').should('exist');
  });

  it('should have breadcrumb navigation', () => {
    cy.get('.breadcrumb').should('exist');
  });

  it('should have back navigation link', () => {
    cy.contains('Back to').should('exist');
  });
});
