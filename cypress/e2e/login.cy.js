/// <reference types="Cypress" />

describe('Login', () => {
  it('Login com sucesso', () => {
    cy.loginSucesso()

    cy.contains('h1', 'Your Notes').should('be.visible')

  })
})

