# 📘 MANUAL — Frontend RM Siantar Minang Jaya

Panduan lengkap instalasi dan penggunaan aplikasi web frontend untuk Rumah Makan Siantar Minang Jaya.

---

## 📋 Prasyarat

Pastikan perangkat Anda sudah terinstal:

| Kebutuhan | Versi Minimal | Cek Versi |
|---|---|---|
| **Node.js** | v18+ | `node -v` |
| **npm** | v9+ | `npm -v` |
| **Git** | Terbaru | `git --version` |

> **Penting:** Pastikan **Backend API** sudah berjalan di `http://localhost:3001` sebelum menjalankan frontend. Lihat `MANUAL.md` di folder `backend-rm-siantar-minang`.

---

## ⚙️ Instalasi

### 1. Clone / Buka Project

Jika belum ada di lokal, clone repository:

```bash
git clone <URL_REPOSITORY>
cd frontend-rm-siantar-minang
```

Atau jika sudah ada, cukup buka folder project.

### 2. Install Dependensi

```bash
npm install
```

Tunggu hingga semua package terinstal.

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Buka file `.env` dan pastikan URL backend sudah benar:

```env
VITE_API_BASE_URL=http://localhost:3001
```

> Jika backend berjalan di port lain, sesuaikan angka `3001` dengan port yang digunakan.

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka browser dan akses:

```
http://localhost:5173
```

---

## 🗺️ Panduan Penggunaan

### 👤 Sebagai Customer (Pelanggan)

#### 1. Registrasi Akun Baru
1. Buka `http://localhost:5173/register`
2. Isi form: **Nama**, **Email**, dan **Password**
3. Klik tombol **Daftar**
4. Anda akan otomatis masuk ke halaman menu

#### 2. Login
1. Buka `http://localhost:5173/login`
2. Masukkan **Email** dan **Password**
3. Klik tombol **Masuk**
4. Sistem akan redirect ke portal sesuai role Anda

#### 3. Melihat & Mencari Menu
1. Setelah login, Anda berada di halaman **Home** / **Menu**
2. Gunakan **filter kategori** (Makanan, Minuman, Paket) untuk menyaring menu
3. Gunakan **search bar** untuk mencari menu tertentu
4. Klik kartu menu untuk melihat detail

#### 4. Memesan Makanan
1. Di halaman **Menu**, klik tombol **Tambah** pada menu yang diinginkan
2. Atur jumlah (+/−) dan isi catatan khusus jika perlu (contoh: "tidak pedas")
3. Ulangi untuk menu lainnya
4. Klik ikon **Keranjang** atau tombol **Lihat Keranjang**
5. Periksa isi keranjang, lalu klik **Checkout**
6. Di halaman checkout:
   - Pilih tipe: **Dine-in** / **Take Away** / **Delivery**
   - Masukkan alamat jika memilih Delivery
   - Masukkan kode promo (jika ada)
   - Pilih metode pembayaran
7. Klik **Buat Pesanan**

#### 5. Tracking Status Pesanan
1. Setelah memesan, Anda akan diarahkan ke halaman **Status Pesanan**
2. Halaman ini menampilkan timeline real-time:
   - 🟡 **Pending** — Menunggu konfirmasi
   - 🔵 **Dikonfirmasi** — Admin/Kasir telah menerima
   - 🟠 **Dimasak** — Dapur sedang memproses
   - 🟢 **Siap** — Pesanan siap diambil
   - ✅ **Selesai** — Pesanan selesai

#### 6. Riwayat Pesanan
1. Buka menu **Riwayat** atau akses `/orders`
2. Lihat semua pesanan yang pernah dibuat
3. Klik **Pesan Lagi** untuk re-order pesanan sebelumnya
4. Klik **Beri Ulasan** untuk memberikan rating

---

### 🪑 Mode QR Code (Tanpa Login)

Mode ini digunakan ketika customer scan QR Code yang tersedia di meja restoran.

1. Scan QR Code di meja menggunakan HP
2. Browser otomatis terbuka ke URL seperti: `http://localhost:5173/qr?table_id=5`
3. Sistem membuat **sesi guest** otomatis tanpa perlu login
4. Anda langsung masuk ke halaman **Menu** dan bisa memesan
5. Pesanan tercatat dengan informasi nomor meja

---

### 🧑‍💼 Sebagai Admin

#### Login Admin
1. Buka `http://localhost:5173/staff/login`
2. Gunakan akun admin default:
   - Email: `admin1@rmsiantar.com`
   - Password: `password123`
3. Sistem akan redirect ke **Dashboard Admin**

#### Kelola Menu
1. Dari sidebar, klik **Menu** → **Manajemen Menu**
2. **Tambah Menu:** Klik tombol **+ Tambah Menu** → isi form → upload foto → simpan
3. **Edit Menu:** Klik ikon edit (pensil) pada baris menu → ubah data → simpan
4. **Hapus Menu:** Klik ikon hapus (tong sampah) → konfirmasi hapus
5. **Nonaktifkan Menu:** Toggle switch pada kolom *Tersedia*

#### Kelola User & Staff
1. Dari sidebar, klik **User** → **Manajemen User**
2. **Tambah Staff:** Klik **+ Tambah User** → isi form → pilih role → simpan
3. **Edit User:** Klik ikon edit pada baris user
4. **Hapus User:** Klik ikon hapus → konfirmasi

#### Monitoring Pesanan
1. Dari sidebar, klik **Order** → **Manajemen Order**
2. Lihat semua pesanan masuk secara real-time
3. Gunakan filter untuk menyaring berdasarkan status atau tanggal
4. Klik pesanan untuk melihat detail
5. Ubah status pesanan jika diperlukan

#### Kelola Promo / Voucher
1. Dari sidebar, klik **Promo**
2. **Buat Promo:** Isi kode, persentase diskon, minimum order, tanggal kedaluwarsa
3. Toggle **Aktif / Nonaktif** untuk mengontrol ketersediaan promo

#### Pengaturan WhatsApp Bot
1. Dari sidebar, klik **WhatsApp**
2. Lihat status koneksi bot
3. Jika terputus, klik **Scan QR** dan scan dengan WhatsApp di HP
4. Monitor pesan masuk dari customer

---

### 👨‍🍳 Sebagai Kitchen (Dapur)

#### Login Kitchen
1. Buka `http://localhost:5173/staff/login`
2. Gunakan akun kitchen:
   - Email: `kitchen1@rmsiantar.com`
   - Password: `password123`
3. Sistem redirect ke **Panel Dapur**

#### Memproses Pesanan
1. Panel dapur menampilkan kartu-kartu pesanan masuk secara real-time
2. Setiap kartu menampilkan: nomor pesanan, daftar item, dan catatan khusus
3. Klik **Mulai Masak** untuk mengubah status ke `cooking`
4. Setelah selesai, klik **Siap Diambil** untuk mengubah status ke `ready`
5. Gunakan filter untuk melihat pesanan berdasarkan status

---

### 🏦 Sebagai Kasir

#### Login Kasir
1. Buka `http://localhost:5173/staff/login`
2. Gunakan akun kasir:
   - Email: `kasir1@rmsiantar.com`
   - Password: `password123`
3. Sistem redirect ke **Panel Kasir (POS)**

#### Proses Pembayaran
1. Panel kasir menampilkan daftar pesanan yang siap dibayar
2. Klik pesanan yang akan diproses
3. Sistem menampilkan detail tagihan
4. Pilih metode pembayaran: **Cash**, **Transfer**, atau **E-Wallet**
5. Jika Cash: masukkan jumlah uang yang diterima → sistem kalkulasi kembalian
6. Klik **Konfirmasi Pembayaran**
7. Klik **Cetak Struk** untuk mencetak bukti pembayaran

---

## 🔧 Perintah Berguna

### Jalankan Dev Server

```bash
npm run dev
```

### Build untuk Production

```bash
npm run build
```

File hasil build tersimpan di folder `dist/`. Deploy ke Nginx, Apache, atau hosting statis.

### Preview Build Production (Lokal)

```bash
npm run preview
```

---

## 🚀 Deployment Production

### Deploy ke Nginx (Linux Server)

1. Build project:
   ```bash
   npm run build
   ```

2. Copy folder `dist/` ke direktori web server:
   ```bash
   cp -r dist/ /var/www/html/rm-siantar-frontend/
   ```

3. Konfigurasi Nginx agar semua route diarahkan ke `index.html` (untuk Vue Router):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html/rm-siantar-frontend;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Deploy ke Laragon (Windows — Development)

1. Build project: `npm run build`
2. Copy folder `dist/` ke `C:\laragon\www\rm-siantar-frontend\`
3. Akses via browser: `http://rm-siantar-frontend.test`

---

## ❓ Troubleshooting

### Halaman kosong / API tidak terhubung
- Pastikan backend sudah berjalan di `http://localhost:3001`
- Periksa nilai `VITE_API_BASE_URL` di file `.env`
- Buka browser DevTools → tab **Network** untuk melihat error response

### Port 5173 sudah digunakan
- Vite akan otomatis mencoba port berikutnya (5174, 5175, dst.)
- Atau hentikan proses lain yang menggunakan port tersebut

### Setelah login tidak diredirect dengan benar
- Pastikan akun memiliki role yang sesuai di database
- Coba clear localStorage browser: DevTools → Application → Local Storage → Clear All

### Foto menu tidak tampil
- Pastikan backend berjalan dan folder `uploads/` dapat diakses
- Periksa URL base di `src/services/api.js`
