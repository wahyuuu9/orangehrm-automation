# Test Automation Login OrangeHRM

Nama: Wahyu Kuncoro

## Tujuan
Membuat test automation menggunakan Cypress dengan format `it` block pada fitur
Login OrangeHRM, berdasarkan 12 test case dari Quiz 2 (sheet "TC Login").

- Aplikasi: OrangeHRM Demo
- URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- Akun demo: Admin / admin123
- Tool: Node.js, Cypress

## Cara Menjalankan
1. Install Node.js (versi LTS).
2. Clone repository ini, lalu masuk ke foldernya.
3. Install dependency:
   ```
   npm install
   ```
4. Jalankan seluruh test (headless):
   ```
   npx cypress run
   ```
   Atau dengan tampilan visual:
   ```
   npx cypress open
   ```

## Struktur Folder
```
cypress/e2e/login.cy.js   -> script test automation (12 it block)
cypress.config.js         -> konfigurasi (baseUrl, timeout, retries)
docs/                     -> test case Quiz 2 (revisi)
screenshots/              -> bukti hasil running
```

## Daftar Test Case
| No | TC ID | Skenario |
|----|-------|----------|
| 1 | TC-LOG-01 | Login dengan username & password valid |
| 2 | TC-LOG-02 | Login dengan username valid dan password salah |
| 3 | TC-LOG-03 | Login dengan username tidak terdaftar dan password valid |
| 4 | TC-LOG-04 | Login dengan username dan password kosong |
| 5 | TC-LOG-05 | Login dengan username kosong, password terisi |
| 6 | TC-LOG-06 | Login dengan password kosong, username terisi |
| 7 | TC-LOG-07 | Login dengan password berbeda huruf besar/kecil |
| 8 | TC-LOG-08 | Karakter password tersamarkan pada field Password |
| 9 | TC-LOG-09 | Login menggunakan tombol Enter pada keyboard |
| 10 | TC-LOG-10 | Login dengan input SQL injection pada username |
| 11 | TC-LOG-11 | Link "Forgot your password?" menuju halaman reset |
| 12 | TC-LOG-12 | Setelah logout, tombol Back tidak membuka halaman terproteksi |

## Catatan
- Script hanya memverifikasi Expected Result fungsional. Bug non-fungsional di
  Quiz 2 (responsive, ARIA, timing pesan validasi, tabindex, trimming, redirect
  tombol Cancel) tidak diotomasi.
- TC-LOG-11: verifikasi pengiriman email reset password tidak dilakukan karena
  server demo tidak menampilkan konfirmasi pengiriman secara konsisten. Test
  dibatasi pada navigasi ke halaman reset, validasi "Required", dan
  pengisian username.
- Test case Quiz 2 direvisi untuk TC-LOG-11 dan TC-LOG-12 (file di folder `docs/`).
- Server demo OrangeHRM bersifat publik dan kadang lambat, sehingga
  `pageLoadTimeout` dan `retries` diatur pada `cypress.config.js`.

## Hasil
12 passing, 0 failing (lihat folder `Capture Test Automation Login OrangeHRM`).


## Tugas 16 - Cypress Intercept
File: `cypress/e2e/intercept/login-intercept.cy.js` (12 test case).

Menjalankan:
npx cypress run --browser chrome --spec "cypress/e2e/intercept/login-intercept.cy.js"

| TC | Intercept | Validasi |
|----|-----------|----------|
| 01 | GET /dashboard/index | Status 200 setelah login valid |
| 02 | GET /auth/login | Status 200 setelah redirect balik |
| 03 | POST /auth/validate | Status 302, Location ke auth/login |
| 04 | POST /auth/validate | Request tidak terkirim |
| 05 | GET /dashboard/index | Tidak pernah diminta |
| 06 | GET /api/v2/** | Tidak ada request API |
| 07 | POST /auth/validate | Body request memuat password=ADMIN123 |
| 08 | GET /auth/login (reload) | Header content-type text/html |
| 09 | GET /api/v2/dashboard/employees/action-summary | Status 200 |
| 10 | GET /api/v2/dashboard/shortcuts | Tidak dipanggil setelah SQL injection |
| 11 | GET /auth/requestPasswordResetCode | Status 200 |
| 12 | GET /auth/logout | Status 302, Location ke auth/login |

Bukti: folder `screenshots/intercept/`.
