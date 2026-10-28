// Tugas 16 - Cypress cy.intercept pada test login OrangeHRM
// Nama : Wahyu Kuncoro
// Setiap test memakai intercept yang berbeda (URL atau validasinya berbeda)

describe('Login OrangeHRM - Intercept', () => {
  const usernameInput = 'input[name="username"]'
  const passwordInput = 'input[name="password"]'
  const loginButton = 'button[type="submit"]'
  const alertError = '.oxd-alert-content-text'
  const fieldError = '.oxd-input-field-error-message'

  Cypress.on('uncaught:exception', () => false)

  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.get(usernameInput).should('be.visible')
  })

  // 1. GET halaman dashboard -> status 200 setelah login valid
  it('TC-LOG-01 - Login valid, halaman dashboard berhasil dimuat', () => {
    cy.intercept('GET', '**/dashboard/index*').as('dashboardPage')

    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()

    cy.wait('@dashboardPage').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.url().should('include', '/dashboard/index')
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard')
  })

  // 2. GET halaman login -> status 200 setelah login gagal (redirect balik)
  it('TC-LOG-02 - Password salah, kembali ke halaman login', () => {
    cy.intercept('GET', '**/auth/login*').as('loginPage')

    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('salah123')
    cy.get(loginButton).click()

    cy.wait('@loginPage').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  // 3. POST auth/validate -> status 302 dan Location mengarah ke halaman login
  it('TC-LOG-03 - Username tidak terdaftar, request validate dialihkan ke login', () => {
    cy.intercept('POST', '**/auth/validate').as('loginSubmit')

    cy.get(usernameInput).type('userxyz')
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()

    cy.wait('@loginSubmit').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
      expect(interception.response.headers.location).to.include('auth/login')
    })
    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  // 4. POST auth/validate -> tidak terkirim (jumlah request = 0)
  it('TC-LOG-04 - Field kosong, request validate tidak terkirim', () => {
    cy.intercept('POST', '**/auth/validate').as('loginSubmit')

    cy.get(loginButton).click()

    cy.get(fieldError).should('have.length', 2)
    cy.get('@loginSubmit.all').should('have.length', 0)
    cy.url().should('include', '/auth/login')
  })

  // 5. GET dashboard -> tidak pernah diminta (jumlah request = 0)
  it('TC-LOG-05 - Username kosong, dashboard tidak diakses', () => {
    cy.intercept('GET', '**/dashboard/index*').as('dashboardPage')

    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()

    cy.get(fieldError).should('have.length', 1)
    cy.get(usernameInput).parents('.oxd-input-group').should('contain', 'Required')
    cy.get('@dashboardPage.all').should('have.length', 0)
  })

  // 6. Semua API v2 -> tidak ada request API (jumlah request = 0)
  it('TC-LOG-06 - Password kosong, tidak ada request API', () => {
    cy.intercept('GET', '**/api/v2/**').as('apiRequest')

    cy.get(usernameInput).type('Admin')
    cy.get(loginButton).click()

    cy.get(fieldError).should('have.length', 1)
    cy.get(passwordInput).parents('.oxd-input-group').should('contain', 'Required')
    cy.get('@apiRequest.all').should('have.length', 0)
  })

  // 7. POST auth/validate -> isi body request memuat password huruf kapital
  it('TC-LOG-07 - Password huruf kapital terkirim apa adanya ke server', () => {
    cy.intercept('POST', '**/auth/validate').as('loginSubmit')

    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('ADMIN123')
    cy.get(loginButton).click()

    cy.wait('@loginSubmit').then((interception) => {
      expect(interception.request.body).to.include('password=ADMIN123')
    })
    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.url().should('include', '/auth/login')
  })

  // 8. GET halaman login (reload) -> header content-type berupa HTML
  it('TC-LOG-08 - Halaman login dimuat sebagai HTML, password tersamarkan', () => {
    cy.intercept('GET', '**/auth/login*').as('loginPage')

    cy.reload()

    cy.wait('@loginPage').then((interception) => {
      expect(interception.response.headers['content-type']).to.include('text/html')
    })
    cy.get(passwordInput).type('admin123')
    cy.get(passwordInput).should('have.attr', 'type', 'password')
    cy.get(passwordInput).should('have.value', 'admin123')
  })

  // 9. GET API action-summary dashboard -> status 200 setelah login via Enter
  it('TC-LOG-09 - Login dengan Enter, API action-summary berhasil', () => {
    cy.intercept('GET', '**/api/v2/dashboard/employees/action-summary*').as('actionSummary')

    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('admin123{enter}')

    cy.wait('@actionSummary').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.url().should('include', '/dashboard/index')
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard')
  })

  // 10. GET API shortcuts dashboard -> tidak pernah diminta setelah SQL injection
  it('TC-LOG-10 - SQL injection ditolak, API dashboard tidak dipanggil', () => {
    cy.intercept('GET', '**/api/v2/dashboard/shortcuts*').as('shortcuts')

    cy.get(usernameInput).type("' OR '1'='1")
    cy.get(passwordInput).type('test')
    cy.get(loginButton).click()

    cy.get(alertError).should('have.text', 'Invalid credentials')
    cy.get('@shortcuts.all').should('have.length', 0)
    cy.url().should('include', '/auth/login')
  })

  // 11. GET halaman reset password -> status 200 setelah klik Forgot password
  it('TC-LOG-11 - Halaman reset password berhasil dimuat', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode*').as('resetPage')

    cy.contains('Forgot your password?').click()

    cy.wait('@resetPage').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.url().should('include', '/auth/requestPasswordResetCode')
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password')

    cy.get(loginButton).click()
    cy.get(fieldError).should('have.text', 'Required')

    cy.get(usernameInput).type('Admin')
    cy.get(usernameInput).should('have.value', 'Admin')
    cy.contains('Cancel').should('be.visible')
  })

  // 12. GET auth/logout -> status 302 dan Location mengarah ke halaman login
  it('TC-LOG-12 - Logout dialihkan ke login, tombol Back tidak membuka dashboard', () => {
    cy.get(usernameInput).type('Admin')
    cy.get(passwordInput).type('admin123')
    cy.get(loginButton).click()
    cy.url().should('include', '/dashboard/index')

    cy.intercept('GET', '**/auth/logout*').as('logoutRequest')

    cy.get('.oxd-userdropdown-tab').click()
    cy.contains('Logout').click()

    cy.wait('@logoutRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
      expect(interception.response.headers.location).to.include('auth/login')
    })
    cy.url().should('include', '/auth/login')

    cy.go('back')

    cy.url().should('include', '/auth/login')
    cy.get(usernameInput).should('be.visible')
  })
})