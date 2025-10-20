describe('Performance', () => {
  it('should load home page within acceptable time', () => {
    const start = Date.now();
    cy.visit('/');
    cy.get('.home-page').should('exist').then(() => {
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(5000); // 5 seconds
    });
  });

  it('should redirect to login for protected feature pages', () => {
    cy.visit('/features/case-management');
    cy.url().should('include', '/login');
    cy.contains('Sign In').should('be.visible');
  });

  it('should handle multiple page navigations efficiently', () => {
    cy.visit('/');
    cy.visit('/login');
    cy.visit('/register');
    cy.visit('/features/case-management');
    cy.url().should('include', '/login');
    cy.contains('Sign In').should('be.visible');
  });

  it('should load CSS and assets', () => {
    cy.visit('/');
    cy.get('body').should('have.css', 'margin');
  });
});
