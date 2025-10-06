describe('Performance', () => {
  it('should load home page within acceptable time', () => {
    const start = Date.now();
    cy.visit('/');
    cy.get('.home-page').should('exist').then(() => {
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(5000); // 5 seconds
    });
  });

  it('should load feature pages efficiently', () => {
    cy.visit('/features/case-management');
    cy.get('.feature-page').should('exist');
  });

  it('should handle multiple page navigations', () => {
    cy.visit('/');
    cy.visit('/login');
    cy.visit('/register');
    cy.visit('/features/case-management');
    cy.get('.feature-page').should('exist');
  });

  it('should load CSS and assets', () => {
    cy.visit('/');
    cy.get('body').should('have.css', 'margin');
  });
});
