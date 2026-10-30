// Kumpulan data yang dipakai di test login
// Kalau ada data berubah, cukup ganti di file ini saja

const loginData = {
  validUser: { username: 'Admin', password: 'admin123' },
  wrongPassword: { username: 'Admin', password: 'salah123' },
  unregisteredUser: { username: 'userxyz', password: 'admin123' },
  upperCasePassword: { username: 'Admin', password: 'ADMIN123' },
  sqlInjection: { username: "' OR '1'='1", password: 'test' },

  emptyBoth: { username: '', password: '' },
  emptyUsername: { username: '', password: 'admin123' },
  emptyPassword: { username: 'Admin', password: '' },

  messages: {
    invalidCredentials: 'Invalid credentials',
    required: 'Required',
  },

  urls: {
    login: '/auth/login',
    dashboard: '/dashboard/index',
    resetPassword: '/auth/requestPasswordResetCode',
  },

  titles: {
    dashboard: 'Dashboard',
    resetPassword: 'Reset Password',
  },
}

export default loginData