import { faker } from '@faker-js/faker/locale/pt_BR'

Cypress.Commands.add('CadastroCodigoEmail', (email, senha
  // pode usar como objeto no exemplo abaixo ou passar o email e senha dentro do comando personalizado cy.CadastroCodigoEmail() em login.cy.js

  //     email = (`${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`),
  //     senha = Cypress.env('USER_PASSWORD')
) => {

  cy.intercept('GET', '**/notes').as('getNotes')

  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(senha, { log: false })
  cy.get('#confirmPassword').type(senha, { log: false })

  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')

  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email
  }).then((mensagem) => {
    console.log(mensagem)
    const codigoConfirmacao = mensagem.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${codigoConfirmacao}{enter}`)

    cy.wait('@getNotes')
  })

})

Cypress.Commands.add('loginSucesso', (
  email = Cypress.env('USER_EMAIL'),
  senha = Cypress.env('USER_PASSWORD')
) => {

  cy.intercept('GET', '**/notes').as('getNotes')

  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(senha, { log: false })

  cy.contains('button', 'Login').click()
  cy.wait('@getNotes')

})

Cypress.Commands.add('sessaoLogin', (
  email = Cypress.env('USER_EMAIL'),
  senha = Cypress.env('USER_PASSWORD')
) => {
  const login = () =>
    cy.loginSucesso(email, senha)
  cy.session(email, login)

})


const selecionaArquivo = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}


Cypress.Commands.add('criarNotas', (criaNotas) => {
  cy.visit('/notes/new')
  cy.get('#content').type(criaNotas)
  cy.contains('button', 'Create').click()


})

Cypress.Commands.add('editarNotas', (criaNotas, atualizaNotas, Arquivo) => {
  cy.contains('.list-group-item', criaNotas)
    .should('be.visible')
    .click()

  cy.get('#content').clear()
  cy.get('#content').type(atualizaNotas)

  if (Arquivo) {
    selecionaArquivo()
  }
  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', atualizaNotas).should('be.visible')
  cy.contains('.list-group-item', criaNotas).should('not.exist')
})

Cypress.Commands.add('deletarNotas', (atualizaNotas) => {
  cy.contains('.list-group-item', atualizaNotas)
    .should('be.visible')
    .click()

  cy.contains('button', 'Delete').click()

  cy.get('.list-group-item')
    .its('length')
    .should('be.at.least', 1)

  cy.contains('.list-group-item', atualizaNotas)
    .should('not.exist')
})

Cypress.Commands.add('preencheInfoCartao', () => {
  const primeiroNome = faker.name.firstName()
  const ultimoNome = faker.name.lastName()

  cy.visit('/settings')

  cy.get('#storage').type('1')
  cy.get('#name').type(`${primeiroNome} ${ultimoNome}`)

  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242 4242 4242 4242')

  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1224')

  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('434', { log: false })

  cy.get('@iframe')
    .find('[name="postal"]')
    .type('82840')



  cy.contains('button', 'Purchase').click()
    .then(($input) => {
      console.log($input)
    })

})

Cypress.Commands.add('logout', () => {
  cy.visit('/')

  if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
    cy.get('.navbar-toggle.collapsed')
      .should('be.visible')
      .click()
  }

  cy.contains('a', 'Logout').click()
  cy.url().should('eq', `${Cypress.config('baseUrl')}/login`)
})