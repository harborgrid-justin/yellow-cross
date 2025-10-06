describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should load the register page successfully', () => {
    cy.contains('Sign Up').should('be.visible');
  });

  it('should display registration form elements', () => {
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('have.length.at.least', 1);
  });

  it('should have link to login page', () => {
    cy.contains('Sign In').should('exist');
  });

  it('should display terms and conditions', () => {
    cy.contains('Terms').should('exist');
  });

  it('should have submit button', () => {
    cy.get('button[type="submit"]').should('exist');
  });
});
