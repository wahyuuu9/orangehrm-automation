// Page object untuk halaman Dashboard

class DashboardPage {
  // ---------- locator ----------
  header() {
    return cy.get('.oxd-topbar-header-breadcrumb')
  }

  userDropdown() {
    return cy.get('.oxd-userdropdown-tab')
  }

  logoutMenu() {
    return cy.contains('Logout')
  }

  // ---------- action ----------
  logout() {
    this.userDropdown().click()
    this.logoutMenu().click()
  }
}

export default new DashboardPage()