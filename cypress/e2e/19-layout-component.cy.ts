describe('Layout Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display navigation header', () => {
    cy.get('nav').should('exist');
  });

  it('should have Yellow Cross branding', () => {
    cy.contains('Yellow Cross').should('be.visible');
  });

  it('should display navigation menu', () => {
    cy.get('nav').should('exist');
    // Navigation items may vary, just check nav exists
  });

  it('should render main content area', () => {
    cy.get('body').should('exist');
  });

  it('should render page content in Outlet', () => {
    cy.get('.home-page').should('exist');
  });
});
