describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should load the login page successfully', () => {
    cy.contains('Sign In').should('be.visible');
  });

  it('should display login form elements', () => {
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should have link to register page', () => {
    cy.contains('Sign Up').should('exist');
  });

  it('should have remember me checkbox', () => {
    cy.get('input[type="checkbox"]').should('exist');
  });

  it('should display forgot password link', () => {
    cy.contains('Forgot Password').should('exist');
  });
});
