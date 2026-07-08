describe('Parcours C2C Collector.shop', () => {
  const randomSuffix = Math.floor(Math.random() * 1000);
  const testUser = `CypressUser${randomSuffix}`;
  const articleTitle = `Casque Audio Vintage ${randomSuffix}`;

  it('Inscrit un nouvel utilisateur et dépose une annonce', () => {
    cy.visit('/');

    cy.contains('button', 'Inscription').click();
    cy.get('input[placeholder="Votre identifiant"]').type(testUser);
    cy.get('input[placeholder="Minimum 6 caractères"]').type('securePass123');
    cy.get('input[placeholder="Répétez votre mot de passe"]').type('securePass123');
    cy.contains('button', 'Créer mon compte').click();

    cy.contains('.header-user', testUser).should('be.visible');

    cy.contains('button', '+ Déposer une annonce').click();

    cy.get('input[placeholder="Ex: Jordan 1 Retro 1985"]').type(articleTitle);
    cy.get('input[placeholder="Ex: Baskets"]').type('Audio');
    cy.get('textarea[placeholder*="Décrivez votre objet"]').type('Parfait état de marche, son stéréo.');
    cy.get('input[placeholder="0.00"]').type('65.50');

    cy.contains('button', 'Publier l\'annonce').click();

    cy.contains('.toast', 'Article publié avec succès !').should('be.visible');
    cy.contains('button', '+ Déposer une annonce').should('be.visible');
    cy.contains('.own-articles-section', articleTitle).should('be.visible');
    cy.contains('.own-articles-section', /65.*€/).should('be.visible');
  });
});
