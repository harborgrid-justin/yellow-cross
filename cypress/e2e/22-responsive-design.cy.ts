describe('Responsive Design', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'macbook-15', width: 1440, height: 900 },
  ];

  viewports.forEach((viewport) => {
    context(`${viewport.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
      });

      it('should display content properly', () => {
        cy.get('.home-page').should('be.visible');
      });

      it('should have accessible navigation', () => {
        cy.get('nav').should('exist');
      });

      it('should display features grid', () => {
        cy.get('.features-grid').should('exist');
      });
    });
  });
});
