// Page object untuk halaman Login

class LoginPage {
  // ---------- locator ----------
  usernameInput() {
    return cy.get('input[name="username"]')
  }

  passwordInput() {
    return cy.get('input[name="password"]')
  }

  loginButton() {
    return cy.get('button[type="submit"]')
  }

  alertError() {
    return cy.get('.oxd-alert-content-text')
  }

  fieldError() {
    return cy.get('.oxd-input-field-error-message')
  }

  forgotPasswordLink() {
    return cy.contains('Forgot your password?')
  }

  // ---------- action ----------
  open() {
    cy.visit('/web/index.php/auth/login')
    this.usernameInput().should('be.visible')
  }

  typeUsername(username) {
    this.usernameInput().type(username)
  }

  typePassword(password) {
    this.passwordInput().type(password)
  }

  clickLogin() {
    this.loginButton().click()
  }

  clickForgotPassword() {
    this.forgotPasswordLink().click()
  }

  // login lengkap, field yang kosong dilewati
  // (cy.type tidak boleh dipakai dengan teks kosong)
  login(user) {
    if (user.username !== '') {
      this.typeUsername(user.username)
    }
    if (user.password !== '') {
      this.typePassword(user.password)
    }
    this.clickLogin()
  }

  // login tanpa klik tombol, submit pakai Enter
  loginWithEnter(user) {
    this.typeUsername(user.username)
    this.passwordInput().type(user.password + '{enter}')
  }
}

export default new LoginPage()