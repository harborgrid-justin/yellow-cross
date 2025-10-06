describe('App Routing', () => {
  it('should navigate to home page', () => {
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should navigate to login page', () => {
    cy.visit('/login');
    cy.url().should('include', '/login');
  });

  it('should navigate to register page', () => {
    cy.visit('/register');
    cy.url().should('include', '/register');
  });

  it('should navigate to feature pages', () => {
    cy.visit('/features/case-management');
    cy.url().should('include', '/features/case-management');
  });

  it('should navigate between pages using links', () => {
    cy.visit('/');
    cy.contains('Sign In').click();
    cy.url().should('include', '/login');
  });
});
