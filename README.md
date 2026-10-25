# Quiz 3 - Test Automation Login OrangeHRM

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
12 passing, 0 failing (lihat folder `screenshots/`).
