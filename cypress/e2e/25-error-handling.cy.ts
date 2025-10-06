describe('Error Handling', () => {
  it('should handle 404 pages gracefully', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    // The page should still load without errors
    cy.get('body').should('exist');
  });

  it('should handle invalid feature routes', () => {
    cy.visit('/features/invalid-feature', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

  it('should handle missing sub-features', () => {
    cy.visit('/features/case-management/invalid-sub-feature', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

  it('should not break on navigation errors', () => {
    cy.visit('/');
    cy.window().then((win) => {
      // Should handle errors gracefully
      expect(win.document.body).to.exist;
    });
  });

  it('should maintain stable state after error', () => {
    cy.visit('/', { failOnStatusCode: false });
    cy.visit('/login');
    cy.contains('Sign In').should('be.visible');
  });
});
