# 💻 SIPEG Frontend - Sistem Informasi Penggajian Karyawan (SPA)

Frontend Single Page Application (SPA) untuk **SIPEG (Sistem Informasi Penggajian Karyawan)** yang dibangun menggunakan **Vue 3**, **Vite**, **Tailwind CSS**, dan **Pinia**. Aplikasi ini dirancang dengan pendekatan arsitektur modular (*feature-driven*) dan dideploy di **Cloudflare Pages** dengan koneksi ke RESTful API Laravel.

---

## ✨ Fitur Utama

- **Antarmuka Modern & Responsif**:
  - Dibangun dengan **Tailwind CSS** untuk tata letak yang bersih, responsif, dan ringan.
  - Komponen sidebar terpusat (`AppSidebar.vue`) yang memuat daftar navigasi dinamis langsung dari database backend.
- **Arsitektur Modular (Feature-Driven)**:
  - Struktur modul terorganisir per domain bisnis (`auth`, `dashboard`, `employees`, `salaries`, `reports`).
  - Pemecahan komponen terarah (*one view, multiple components*) untuk menjaga skalabilitas dan kemudahan *maintenance*.
- **Master Data Karyawan**:
  - Tabel data karyawan dengan pencarian teks, filter per departemen, dan paginasi.
  - Modal form terpisah untuk Tambah/Edit Karyawan dan dialog konfirmasi hapus.
  - Fitur **Import CSV/Excel** untuk penambahan data karyawan massal.
- **Transaksi Penggajian Bulanan**:
  - Ringkasan statistik cepat: Total Gaji Dibayarkan (Lunas), Nominal Draft, dan Jumlah Transaksi.
  - Filter interaktif berdasarkan bulan, tahun, status pembayaran (*Draft* / *Lunas*), serta pencarian.
  - Tombol **Generate Gaji** otomatis dengan modal konfirmasi modern.
  - Form modal untuk input transaksi gaji manual serta edit potongan (*deduction*) dan status pembayaran.
- **Laporan Penggajian & Cetak Fisik/PDF**:
  - Filter rekapitulasi data berdasarkan periode dan departemen.
  - Tabel rekapitulasi lengkap dengan baris agregat **Grand Total**.
  - Styling cetak teroptimasi (`@media print`) yang otomatis menampilkan kop surat perusahaan dan kolom tanda tangan resmi serta menyembunyikan sidebar/tombol navigasi.
- **Keamanan & State Management**:
  - Manajemen sesi pengguna tersentralisasi menggunakan **Pinia**.
  - Klien HTTP (Axios) terkonfigurasi dengan injeksi otomatis header `Authorization: Bearer <token>` dan header validasi `X-API-KEY`.
  - Proteksi rute menggunakan Vue Router Navigation Guard (`beforeEach`).

---

## 🛠️ Tech Stack & Library

- **Core**: [Vue 3](https://vuejs.org/) (Composition API / `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/) (HTML5 History Mode + Lazy Loading)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Font Awesome Free](https://fontawesome.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📂 Struktur Direktori Proyek

```text
sipeg-frontend/
├── public/
│   └── _redirects              # Konfigurasi SPA routing fallback untuk Cloudflare Pages
├── src/
│   ├── app/
│   │   └── api/
│   │       └── client.js       # Konfigurasi instance Axios, Base URL, dan Interceptors
│   ├── components/
│   │   └── AppSidebar.vue      # Komponen navigasi sidebar dinamis
│   ├── modules/
│   │   ├── auth/               # Modul login, autentikasi, & auth store
│   │   ├── dashboard/          # Modul ringkasan dashboard statistik
│   │   ├── employees/          # Modul master karyawan (Table, Form, Import, Delete modals)
│   │   ├── salaries/           # Modul transaksi gaji (Cards, Table, Manual, Edit modals)
│   │   └── reports/            # Modul laporan penggajian (Filter, Table, Print signature)
│   ├── router/
│   │   └── index.js            # Sentralisasi route dengan dynamic/lazy import & auth guard
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env.example
├── index.html
├── package.json
└── vite.config.js