/// <reference types="Cypress" />

import { faker } from '@faker-js/faker/locale/en'

describe('Crud e compra no cartão', () => {
  beforeEach(() => {
    cy.sessaoLogin()
  })
  it('Crud sucesso', () => {

    const criaNotas = faker.lorem.words(3)

    cy.intercept('GET', '**/notes').as('getNotes')

    cy.criarNotas(criaNotas)
    cy.wait('@getNotes')


    const atualizaNotas = faker.lorem.words(4)
    const Arquivo = true

    cy.intercept('GET', '**/notes/**').as('getNote')

    cy.editarNotas(criaNotas, atualizaNotas, Arquivo)
    cy.wait('@getNote')

    cy.deletarNotas(atualizaNotas)
    cy.wait('@getNotes')

  })

  it('Prenchimento cartao', () => {
    cy.intercept('POST', '**/prod/billing').as('paySucess')

    cy.preencheInfoCartao()

    cy.wait('@paySucess')
      .its('state')
      .should('be.equal', 'Complete')
  })

  it('Logout', () => {
    cy.logout()
  })
})