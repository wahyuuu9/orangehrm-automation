// Quiz 3 - Test Automation Login OrangeHRM (Cypress)
// Nama   : Wahyu Kuncoro
// Sumber : Test case Quiz 2 (sheet "TC Login", TC-LOG-01 s/d TC-LOG-12)

describe('Login OrangeHRM', () => {
  // Locator dikumpulkan di satu tempat supaya mudah dibaca & diubah
  const usernameInput = 'input[name="username"]'
  const passwordInput = 'input[name="password"]'
  const loginButton = 'button[type="submit"]'
  const alertError = '.oxd-alert-content-text'
  const fieldError = '.oxd-input-field-error-message'

  // Demo OrangeHRM kadang melempar error JS dari aplikasinya sendiri,
  // agar tidak membuat test gagal karena hal di luar skenario kita
  Cypress.on('uncaught:exception', () => false)

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get(usernameInput).should('be.visible')
  })

  it('TC-LOG-01 - Login dengan username & password valid', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()

    cy.url().should('include', '/dashboard/index')
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard')
  })

  it('TC-LOG-02 - Login dengan username valid dan password salah', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('salah123')
    cy.get(loginButton).click()

    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-03 - Login dengan username tidak terdaftar dan password valid', () => {
    cy.get(usernameInput).type('userxyz')
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()

    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-04 - Login dengan username dan password kosong', () => {
    cy.get(loginButton).click()

    cy.get(fieldError).should('have.length', 2)
    cy.get(fieldError).each(($el) => {
      cy.wrap($el).should('have.text', 'Required')
    })
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-05 - Login dengan username kosong, password terisi', () => {
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()

    cy.get(fieldError).should('have.length', 1)
    cy.get(usernameInput).parents('.oxd-input-group').should('contain', 'Required')
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-06 - Login dengan password kosong, username terisi', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(loginButton).click()

    cy.get(fieldError).should('have.length', 1)
    cy.get(passwordInput).parents('.oxd-input-group').should('contain', 'Required')
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-07 - Login dengan password berbeda huruf besar/kecil', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('ADMIN123')
    cy.get(loginButton).click()

    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-08 - Karakter password tersamarkan pada field Password', () => {
    cy.get(passwordInput).type('admin123')

    cy.get(passwordInput).should('have.attr', 'type', 'password')
    cy.get(passwordInput).should('have.value', 'admin123')
  })

  it('TC-LOG-09 - Login menggunakan tombol Enter pada keyboard', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('admin123{enter}')

    cy.url().should('include', '/dashboard/index')
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard')
  })

  it('TC-LOG-10 - Login dengan input SQL injection pada username', () => {
    cy.get(usernameInput).type("' OR '1'='1")
    cy.get(passwordInput).type('test')
    cy.get(loginButton).click()

    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  it('TC-LOG-11 - Link Forgot your password menuju halaman reset', () => {
    cy.contains('Forgot your password?').click()

    cy.url().should('include', '/auth/requestPasswordResetCode')
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password')

    // Username kosong -> Required
    cy.get(loginButton).click()
    cy.get(fieldError).should('have.text', 'Required')

    // Username diisi -> field terisi, tombol Reset Password dan Cancel tersedia
    cy.get(usernameInput).type('Admin')
    cy.get(usernameInput).should('have.value', 'Admin')
    cy.get(loginButton).should('be.visible')
    cy.contains('Cancel').should('be.visible')
  })

  it('TC-LOG-12 - Setelah logout, tombol Back tidak membuka halaman terproteksi', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()
    cy.url().should('include', '/dashboard/index')

    cy.get('.oxd-userdropdown-tab').click()
    cy.contains('Logout').click()
    cy.url().should('include', '/auth/login')

    cy.go('back')

    cy.url().should('include', '/auth/login')
    cy.get(usernameInput).should('be.visible')
  })
})