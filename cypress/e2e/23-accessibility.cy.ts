describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have proper page title', () => {
    cy.title().should('not.be.empty');
  });

  it('should have accessible headings hierarchy', () => {
    cy.get('h1').should('exist');
  });

  it('should have accessible navigation landmarks', () => {
    cy.get('[role="banner"]').should('exist');
  });

  it('should have focusable interactive elements', () => {
    cy.get('a, button').first().should('be.visible');
  });

  it('should support keyboard navigation', () => {
    cy.get('a').first().focus();
    cy.focused().should('exist');
  });
});
