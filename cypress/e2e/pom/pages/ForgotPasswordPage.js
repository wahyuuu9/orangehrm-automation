// Page object untuk halaman Reset Password (Forgot your password)

class ForgotPasswordPage {
  // ---------- locator ----------
  title() {
    return cy.get('.orangehrm-forgot-password-title')
  }

  usernameInput() {
    return cy.get('input[name="username"]')
  }

  resetButton() {
    return cy.get('button[type="submit"]')
  }

  cancelButton() {
    return cy.contains('Cancel')
  }

  fieldError() {
    return cy.get('.oxd-input-field-error-message')
  }

  // ---------- action ----------
  typeUsername(username) {
    this.usernameInput().type(username)
  }

  clickReset() {
    this.resetButton().click()
  }
}

export default new ForgotPasswordPage()