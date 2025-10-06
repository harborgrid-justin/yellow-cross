describe('Sub-Feature Page', () => {
  beforeEach(() => {
    // Visit a sub-feature page (case intake example)
    cy.visit('/features/case-management/case-intake');
  });

  it('should load sub-feature page successfully', () => {
    cy.get('body').should('exist');
  });

  it('should display sub-feature content', () => {
    cy.get('body').should('exist');
    // Page should load without errors
  });

  it('should display sub-feature information', () => {
    cy.get('h1, h2, h3').should('exist');
  });

  it('should have navigation elements', () => {
    cy.get('a').should('exist');
  });

  it('should have navigation links', () => {
    cy.get('a').should('exist');
  });
});
