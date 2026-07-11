# 🍽️ Materi Presentasi Teman 1: Aplikasi Pelanggan & Pemesanan QR Code

Dokumen ini berisi materi presentasi untuk **Teman 1**. Materi ini berfokus pada **sisi pelanggan (Customer-Facing Application)**, alur pemesanan makanan, fitur pemesanan meja menggunakan QR Code, serta interaksi pelanggan melalui integrasi Chatbot WhatsApp.

---

## 🏠 Deskripsi Umum Aplikasi Pelanggan

Aplikasi RM Siantar Minang Jaya dirancang dengan pendekatan **mobile-first**, yang memastikan tampilan sangat responsif dan nyaman diakses langsung dari smartphone pelanggan. Halaman pelanggan ini memungkinkan mereka untuk melihat daftar menu, menyaring makanan berdasarkan kategori, mengatur pesanan dalam keranjang belanja, hingga melakukan proses *checkout* mandiri. Sistem ini meminimalisir kesalahan pemesanan manual dan mempercepat proses pelayanan di restoran.

---

## 🎯 Poin-Poin Fitur & Penjelasan Teknis

Berikut adalah detail fitur yang perlu dipresentasikan:

### 1. Halaman Utama / Home (`/`)
*Halaman awal yang menyambut pelanggan dengan promosi terbaru dan menu terpopuler.*
* **Spanduk Selamat Datang (Welcome Banner)**: Menampilkan branding khas Rumah Makan Siantar Minang Jaya beserta info promo berjalan.
* **Kategori Menu Cepat**: Akses cepat ke kategori utama seperti Makanan, Minuman, dan Paket Hemat.
* **Bagian Best Seller**: Menampilkan daftar menu paling sering dipesan oleh pelanggan untuk memudahkan pengambilan keputusan.

### 2. Katalog Menu Interaktif (`/menu`)
*Katalog digital lengkap dengan fitur pencarian dan penyaringan dinamis.*
* **Grid Kartu Menu**: Kartu menu yang dilengkapi dengan foto beresolusi tinggi, nama menu, harga, dan status ketersediaan.
* **Filter Kategori**: Kemampuan menyaring menu (misal hanya menampilkan "Minuman" atau "Paket") tanpa memuat ulang halaman (Single Page Application).
* **Fitur Pencarian (Search Bar)**: Membantu pelanggan mencari menu spesifik secara instan berdasarkan kata kunci nama menu.
* **Quick Add to Cart**: Tombol cepat untuk langsung menambahkan item ke keranjang belanja dari kartu menu.

### 3. Keranjang Belanja / Cart (`/cart`)
*Halaman manajemen item sebelum melakukan pembayaran.*
* **Daftar Pilihan Item**: Menampilkan semua makanan/minuman yang telah dipilih beserta kuantitasnya.
* **Kontrol Kuantitas Tambah/Kurang (+/−)**: Memudahkan penyesuaian jumlah pesanan secara langsung di keranjang.
* **Catatan Khusus Per Item**: Kolom catatan kustom bagi pelanggan untuk memberikan instruksi khusus ke dapur (contoh: "tidak pakai cabe", "es teh manis dipisah").
* **Kalkulasi Subtotal**: Perhitungan harga otomatis yang diperbarui secara langsung saat jumlah item diubah.

### 4. Proses Checkout & Metode Pemesanan (`/checkout`)
*Formulir akhir sebelum pesanan dikirimkan ke sistem antrean.*
* **Opsi Tipe Pesanan**: Pelanggan dapat memilih apakah ingin makan di tempat (**Dine-in**), dibawa pulang (**Take Away**), atau dikirim ke rumah (**Delivery**).
* **Formulir Pengiriman**: Input alamat lengkap secara khusus apabila pelanggan memilih opsi Delivery.
* **Kode Voucher/Promo**: Kolom untuk memasukkan kode potongan harga guna mendapatkan diskon tambahan.
* **Pilihan Pembayaran**: Mendukung pembayaran melalui **Cash** (Tunai di kasir), **Transfer Bank**, atau **E-Wallet** (seperti QRIS/OVO/Dana).

### 5. Pelacakan Status Pesanan Real-time (`/order-status/:id`)
*Halaman pemantauan pesanan agar pelanggan tahu kapan makanan mereka siap.*
* **Timeline Visual Status**: Progress bar interaktif yang menunjukkan tahapan pesanan: `Pending` ➔ `Dikonfirmasi` ➔ `Dimasak` ➔ `Siap` ➔ `Selesai`.
* **Detail Transaksi**: Rincian lengkap menu yang dibeli, harga, catatan dapur, serta instruksi pembayaran transfer/e-wallet.

### 6. Sesi QR Code Tanpa Login (`/qr`)
*Fitur instan untuk pelanggan dine-in langsung di meja restoran.*
* **Scan Meja Otomatis**: Ketika pelanggan memindai QR Code di meja makan, URL akan mendeteksi ID meja (`table_id`).
* **Sesi Tamu (Guest Session)**: Pelanggan tidak perlu melakukan registrasi atau login akun; sistem langsung membuatkan sesi tamu agar mereka bisa langsung memesan.
* **Auto-routing**: Setelah QR berhasil diverifikasi, pelanggan otomatis diarahkan ke katalog menu dengan meja yang sudah terkunci di sistem.

### 7. Integrasi Pelacakan WhatsApp Bot
*Kemudahan akses informasi pesanan lewat platform chat terpopuler.*
* **Notifikasi WhatsApp**: Sinkronisasi status pesanan yang dikirimkan langsung ke nomor WhatsApp pelanggan.
* **Pemesanan via Chat**: Kemampuan chatbot untuk membantu pelanggan memeriksa menu dan melacak status pesanan hanya dengan mengirim pesan teks ke bot restoran.
