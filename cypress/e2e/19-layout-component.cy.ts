describe('Layout Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display navigation header', () => {
    cy.get('header').should('exist');
    cy.get('nav').should('exist');
  });

  it('should have Yellow Cross branding', () => {
    cy.contains('Yellow Cross').should('be.visible');
  });

  it('should display navigation menu', () => {
    cy.get('nav').within(() => {
      cy.contains('Home').should('exist');
      cy.contains('Login').should('exist');
      cy.contains('Sign Up').should('exist');
    });
  });

  it('should display footer', () => {
    cy.get('footer').should('exist');
  });

  it('should render page content in Outlet', () => {
    cy.get('.home-page').should('exist');
  });
});
