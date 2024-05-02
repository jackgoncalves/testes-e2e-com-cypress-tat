import { faker } from '@faker-js/faker/locale/pt_BR'
/// <reference types="Cypress" />

describe('Cadastro', () => {
  // Pode criar uma variavel como exemplo abaixo e passar no comando personalizado ou passar como objeto o email e senha no commands.js

  const email = (`${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`)
  const senha = Cypress.env('USER_PASSWORD')
  it('Cadastro com sucesso', () => {

    cy.CadastroCodigoEmail(email, senha)

    cy.contains('h1', 'Your Notes').should('be.visible')
  })

})

