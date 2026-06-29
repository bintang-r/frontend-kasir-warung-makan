# 🍽️ Frontend — RM Siantar Minang Jaya

Aplikasi web frontend untuk Sistem Informasi Pemesanan Menu Rumah Makan Siantar Minang Jaya. Dibangun dengan Vue 3 dan mendukung berbagai mode pemesanan: langsung via UI, scan QR Code meja, maupun melalui Chatbot WhatsApp.

---

## 🧰 Tech Stack

| Teknologi | Keterangan |
|---|---|
| **Vue 3** | Framework JavaScript (Composition API) |
| **Vite** | Build tool & dev server |
| **Vue Router** | Routing antar halaman |
| **Pinia** | State management |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | HTTP client untuk komunikasi ke API |
| **Chart.js + vue-chartjs** | Visualisasi grafik di dashboard |
| **Lucide Vue + Heroicons** | Library icon |
| **print-js** | Cetak struk pembayaran |
| **xlsx** | Export data ke Excel |

---

## 🗺️ Halaman & Fitur

### 👤 Halaman Customer (Pelanggan)

#### 🏠 Home (`/`)
![gambar1.png](./gambar1.png)
- Banner selamat datang restoran
- Daftar kategori menu (Makanan, Minuman, Paket)
- Bagian *Best Seller* — menu paling populer
- Navigasi cepat ke halaman Menu

#### 🍽️ Menu (`/menu`)
![gambar1.png](./gambar1.png)
- Grid kartu menu dengan foto, nama, dan harga
- Filter berdasarkan kategori
- Search bar untuk pencarian menu
- Tombol **Tambah ke Keranjang** di setiap kartu menu

#### 🛒 Keranjang / Cart (`/cart`)
![gambar1.png](./gambar1.png)
- Daftar item yang dipilih beserta foto & harga
- Kontrol jumlah (+/−) tiap item
- Kolom catatan khusus per item (contoh: "tidak pedas")
- Ringkasan subtotal & total harga
- Tombol **Checkout**

#### 💳 Checkout (`/checkout`)
![gambar1.png](./gambar1.png)
- Pilih tipe pesanan: **Dine-in** / **Take Away** / **Delivery**
- Input alamat pengiriman (khusus Delivery)
- Input kode promo / voucher
- Pilih metode pembayaran: **Cash**, **Transfer**, **E-Wallet**
- Ringkasan pesanan sebelum dikonfirmasi
- Tombol **Buat Pesanan**

#### 📦 Status Pesanan (`/order-status/:id`)
![gambar1.png](./gambar1.png)
- Timeline visual status pesanan secara real-time:
  - `Pending` → `Dikonfirmasi` → `Dimasak` → `Siap` → `Selesai`
- Daftar item yang dipesan
- Detail pembayaran

#### 📋 Riwayat Pesanan (`/orders`)
![gambar1.png](./gambar1.png)
- List semua pesanan yang pernah dibuat
- Filter berdasarkan status
- Tombol **Pesan Lagi** (re-order)
- Tombol **Beri Ulasan** untuk pesanan yang sudah selesai

#### 💬 Pembayaran (`/order-payment/:id`)
![gambar1.png](./gambar1.png)
- Informasi tagihan yang harus dibayar
- Instruksi pembayaran (transfer / e-wallet)
- Konfirmasi status pembayaran

#### 👤 Profil (`/profile`)
![gambar1.png](./gambar1.png)
- Informasi akun (nama, email, nomor HP)
- Edit profil
- Tombol Logout

---

### 🔐 Autentikasi

#### Login Customer (`/login`)
![gambar1.png](./gambar1.png)
- Form login dengan email & password
- Link ke halaman registrasi
- Redirect otomatis berdasarkan role setelah login

#### Register (`/register`)
![gambar1.png](./gambar1.png)
- Form registrasi akun baru (nama, email, password)
- Validasi input

#### 🪑 QR Session (`/qr`)
![gambar1.png](./gambar1.png)
- Halaman yang terbuka saat customer scan QR meja
- Deteksi otomatis `table_id` dari URL parameter
- Membuat sesi guest tanpa perlu login
- Redirect langsung ke halaman Menu

---

### 🧑‍💼 Panel Staff

#### Login Staff (`/staff/login`)
![gambar1.png](./gambar1.png)
- Form login khusus untuk staff (ADMIN, KASIR, KITCHEN, DRIVER, SUPERADMIN)
- Redirect otomatis ke portal masing-masing sesuai role

#### 📊 Dashboard Admin (`/staff/admin`)
![gambar1.png](./gambar1.png)
- Statistik ringkas: total pendapatan hari ini, total order, user baru
- Grafik penjualan mingguan / bulanan (Chart.js)
- Akses cepat ke semua menu manajemen

#### 🍽️ Manajemen Menu (`/staff/admin/menus`)
![gambar1.png](./gambar1.png)
- Tabel daftar semua menu
- Tambah / Edit / Hapus menu
- Upload foto menu
- Toggle ketersediaan menu (aktif / nonaktif)

#### 🗂️ Manajemen Kategori (dalam menu manajemen)
- CRUD kategori menu
- Urutan tampilan kategori

#### 👥 Manajemen User (`/staff/admin/users`)
![gambar1.png](./gambar1.png)
- Daftar semua user & staff
- Tambah / Edit / Hapus akun
- Assign role (ADMIN, KASIR, KITCHEN, DRIVER, CUSTOMER)
- Suspend / aktifkan akun

#### 📦 Manajemen Order (`/staff/admin/orders`)
![gambar1.png](./gambar1.png)
- Monitoring semua pesanan masuk secara real-time
- Filter berdasarkan status, tanggal, tipe pesanan
- Update status order manual
- Detail pesanan lengkap

#### 💳 Manajemen Pembayaran (`/staff/admin/payments`)
![gambar1.png](./gambar1.png)
- Daftar semua transaksi pembayaran
- Filter berdasarkan status (paid / unpaid)
- Verifikasi pembayaran transfer

#### 🎟️ Manajemen Promo (`/staff/admin/promos`)
![gambar1.png](./gambar1.png)
- CRUD promo / voucher diskon
- Atur batas waktu, minimum order, dan persentase diskon
- Toggle aktif / nonaktif

#### ⭐ Manajemen Review (`/staff/admin/reviews`)
![gambar1.png](./gambar1.png)
- Daftar semua ulasan pelanggan
- Filter berdasarkan rating
- Hapus review tidak pantas

#### 📱 Pengaturan WhatsApp Bot (`/staff/admin/whatsapp`)
![gambar1.png](./gambar1.png)
- Status koneksi bot WhatsApp (aktif / terputus)
- Scan QR untuk menghubungkan WhatsApp
- Log pesan masuk dari chatbot

#### 🏗️ Infrastruktur (`/staff/admin/infrastructure`)
![gambar1.png](./gambar1.png)
- Monitoring status server & database
- Pengaturan koneksi sistem

#### 🎨 Branding (`/staff/admin/branding`)
![gambar1.png](./gambar1.png)
- Kelola identitas restoran (nama, logo, alamat)
- Pengaturan tampilan aplikasi

#### 📋 System Logs (`/staff/admin/logs`)
![gambar1.png](./gambar1.png)
- Log aktivitas sistem
- Pantau aksi yang dilakukan user & staff

---

### 👨‍🍳 Panel Dapur — Kitchen (`/staff/kitchen`)
![gambar1.png](./gambar1.png)
- Tampilan Kanban / board pesanan masuk secara real-time
- Kartu order berisi daftar item & catatan khusus
- Tombol update status: **Mulai Masak** → **Siap Diambil**
- Filter berdasarkan status pesanan
- Dark mode untuk kenyamanan di dapur

### 🏦 Panel Kasir — POS (`/staff/cashier`)
![gambar1.png](./gambar1.png)
- Antarmuka Point of Sale (POS) lengkap
- Daftar order yang sudah siap untuk dibayar
- Input jumlah pembayaran & kalkulasi kembalian
- Pilih metode pembayaran (Cash / Transfer / E-Wallet)
- **Cetak Struk** pembayaran (print-js)
- Riwayat transaksi harian

---

## 🔀 Navigasi Berdasarkan Role

| Role | Portal | Route Default |
|---|---|---|
| `SUPERADMIN` | Panel Admin + akses log | `/staff/admin` |
| `ADMIN` | Panel Admin | `/staff/admin` |
| `KASIR` | Panel POS Kasir | `/staff/cashier` |
| `KITCHEN` | Panel Dapur | `/staff/kitchen` |
| `CUSTOMER` | Aplikasi Customer | `/menu` |
| `GUEST` (QR) | Aplikasi Customer (tanpa login) | `/menu` |

> Staff tidak bisa mengakses portal role lain. Sistem otomatis redirect jika mencoba akses yang tidak sesuai.

---

## 🤖 Integrasi Chatbot (WhatsApp)

- Chatbot WhatsApp terintegrasi dengan backend
- Customer dapat memesan, cek menu, dan tracking status via WhatsApp
- Admin dapat memantau & mengambil alih percakapan dari panel WhatsApp

---

## 📱 Fitur Tambahan

- **Real-time update** status pesanan via WebSocket (Socket.io)
- **QR Code Mode** — pesan tanpa login, langsung dari meja
- **Responsive design** — mobile-first, optimal di HP & tablet
- **Export data** — export laporan ke Excel (xlsx)
- **Print struk** — cetak bukti pembayaran langsung dari browser
