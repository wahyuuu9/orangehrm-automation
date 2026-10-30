// Tugas 17 - Test login OrangeHRM dengan Page Object Model (POM)
// Nama : Wahyu Kuncoro

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import data from './data/loginData'

describe('Login OrangeHRM - POM', () => {
  Cypress.on('uncaught:exception', () => false)

  beforeEach(() => {
    LoginPage.open()
  })

  it('TC-LOG-01 - Login dengan username & password valid', () => {
    LoginPage.login(data.validUser)

    cy.url().should('include', data.urls.dashboard)
    DashboardPage.header().should('contain', data.titles.dashboard)
  })

  it('TC-LOG-02 - Login dengan username valid dan password salah', () => {
    LoginPage.login(data.wrongPassword)

    LoginPage.alertError().should('have.text', data.messages.invalidCredentials)
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-03 - Login dengan username tidak terdaftar dan password valid', () => {
    LoginPage.login(data.unregisteredUser)

    LoginPage.alertError().should('have.text', data.messages.invalidCredentials)
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-04 - Login dengan username dan password kosong', () => {
    LoginPage.login(data.emptyBoth)

    LoginPage.fieldError().should('have.length', 2)
    LoginPage.fieldError().each(($el) => {
      cy.wrap($el).should('have.text', data.messages.required)
    })
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-05 - Login dengan username kosong, password terisi', () => {
    LoginPage.login(data.emptyUsername)

    LoginPage.fieldError().should('have.length', 1)
    LoginPage.usernameInput().parents('.oxd-input-group').should('contain', data.messages.required)
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-06 - Login dengan password kosong, username terisi', () => {
    LoginPage.login(data.emptyPassword)

    LoginPage.fieldError().should('have.length', 1)
    LoginPage.passwordInput().parents('.oxd-input-group').should('contain', data.messages.required)
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-07 - Login dengan password berbeda huruf besar/kecil', () => {
    LoginPage.login(data.upperCasePassword)

    LoginPage.alertError().should('have.text', data.messages.invalidCredentials)
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-08 - Karakter password tersamarkan pada field Password', () => {
    LoginPage.typePassword(data.validUser.password)

    LoginPage.passwordInput().should('have.attr', 'type', 'password')
    LoginPage.passwordInput().should('have.value', data.validUser.password)
  })

  it('TC-LOG-09 - Login menggunakan tombol Enter pada keyboard', () => {
    LoginPage.loginWithEnter(data.validUser)

    cy.url().should('include', data.urls.dashboard)
    DashboardPage.header().should('contain', data.titles.dashboard)
  })

  it('TC-LOG-10 - Login dengan input SQL injection pada username', () => {
    LoginPage.login(data.sqlInjection)

    LoginPage.alertError().should('have.text', data.messages.invalidCredentials)
    cy.url().should('include', data.urls.login)
  })

  it('TC-LOG-11 - Link Forgot your password menuju halaman reset', () => {
    LoginPage.clickForgotPassword()

    cy.url().should('include', data.urls.resetPassword)
    ForgotPasswordPage.title().should('contain', data.titles.resetPassword)

    // username kosong -> Required
    ForgotPasswordPage.clickReset()
    ForgotPasswordPage.fieldError().should('have.text', data.messages.required)

    // username diisi -> field terisi, tombol Cancel ada
    ForgotPasswordPage.typeUsername(data.validUser.username)
    ForgotPasswordPage.usernameInput().should('have.value', data.validUser.username)
    ForgotPasswordPage.cancelButton().should('be.visible')
  })

  it('TC-LOG-12 - Setelah logout, tombol Back tidak membuka halaman terproteksi', () => {
    LoginPage.login(data.validUser)
    cy.url().should('include', data.urls.dashboard)

    DashboardPage.logout()
    cy.url().should('include', data.urls.login)

    cy.go('back')

    cy.url().should('include', data.urls.login)
    LoginPage.usernameInput().should('be.visible')
  })
})