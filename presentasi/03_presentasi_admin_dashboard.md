# 📊 Materi Presentasi Teman 2: Panel Admin & Manajemen Sistem

Dokumen ini berisi materi presentasi untuk **Teman 2**. Materi ini berfokus pada **sisi Back-office / Administrator (Admin Panel)** yang digunakan oleh pemilik restoran atau manajer untuk mengelola menu, memantau penjualan, mengatur staf, dan mengonfigurasi integrasi sistem.

---

## 💻 Deskripsi Umum Panel Admin

Panel Admin merupakan pusat kendali operasional dan bisnis dari aplikasi RM Siantar Minang Jaya. Berbeda dengan halaman pelanggan yang menggunakan pendekatan *mobile-first*, Panel Admin dirancang dengan tata letak **sidebar-based** yang optimal untuk desktop agar admin dapat mengelola data dalam jumlah besar dengan nyaman. Melalui panel ini, admin memiliki kontrol penuh terhadap persediaan menu, manajemen pengguna, pembuatan promo belanja, hingga pemantauan kesehatan infrastruktur server secara real-time.

---

## 🎯 Poin-Poin Fitur & Penjelasan Teknis

Berikut adalah detail fitur yang perlu dipresentasikan:

### 1. Dasbor Statistik & Analitik Penjualan (`/staff/admin`)
*Halaman pertama admin yang memberikan gambaran performa bisnis secara ringkas.*
* **Kartu Ringkasan KPI**: Menampilkan statistik pendapatan hari ini, jumlah pesanan masuk, dan pendaftaran pengguna baru.
* **Grafik Visual Penjualan**: Grafik garis dan batang interaktif (menggunakan library **Chart.js + vue-chartjs**) untuk menganalisis tren omzet mingguan atau bulanan secara visual.
* **Navigasi Pintasan**: Tombol akses cepat ke manajemen menu yang paling sering diakses.

### 2. Manajemen Menu & Kategori (`/staff/admin/menus`)
*Fitur untuk mengelola produk kuliner yang dijual di aplikasi.*
* **Operasi CRUD Menu**: Membuat baru (Create), menampilkan (Read), mengubah detail (Update), dan menghapus (Delete) menu makanan atau minuman.
* **Manajemen Media & Foto**: Unggah foto menu langsung dari komputer untuk ditampilkan ke pelanggan.
* **Toggle Ketersediaan**: Tombol sekali klik untuk mengubah status menu (Aktif/Tersedia atau Nonaktif/Habis) agar langsung terupdate di sisi pelanggan secara instan.
* **CRUD Kategori**: Manajemen kategori menu (seperti "Lauk", "Sayur", "Minuman") beserta penentuan urutan tampilannya di katalog customer.

### 3. Manajemen Staf & Pengguna (`/staff/admin/users`)
*Mengelola hak akses seluruh pengguna sistem.*
* **Daftar Pengguna Terpusat**: Tabel database yang menampilkan seluruh akun terdaftar, baik pelanggan maupun staf restoran.
* **Pembagian Peran (Role Assignment)**: Menugaskan peran spesifik kepada staf baru, seperti `SUPERADMIN`, `ADMIN`, `KASIR`, `KITCHEN`, atau `DRIVER`.
* **Keamanan Akun (Suspend/Active)**: Fitur untuk menonaktifkan sementara akun yang bermasalah atau mengaktifkan kembali akun tersebut.

### 4. Manajemen Kupon Promo & Diskon (`/staff/admin/promos`)
*Pusat pengelolaan strategi pemasaran restoran.*
* **CRUD Voucher**: Membuat kode voucher belanja unik beserta persentase atau nominal diskonnya.
* **Aturan Pembatasan**: Menentukan tanggal kedaluwarsa kupon, batas kuota penggunaan, dan batas minimal pembelian (*minimum order*) agar promo tepat sasaran.

### 5. Manajemen Ulasan & Review (`/staff/admin/reviews`)
*Melihat dan mengelola umpan balik dari pelanggan.*
* **Pemantauan Rating**: Menampilkan ulasan bintang 1-5 beserta komentar yang ditulis pelanggan setelah pesanan mereka selesai.
* **Moderasi Konten**: Menghapus ulasan tidak sopan atau ulasan spam yang dapat merusak reputasi restoran.

### 6. Pengaturan WhatsApp Bot & System Logs (`/staff/admin/whatsapp`)
*Kontrol integrasi eksternal dan keamanan sistem.*
* **Koneksi WhatsApp Gateway**: Menampilkan status koneksi bot WhatsApp (aktif atau terputus) serta menyediakan fitur scan QR code untuk menghubungkan WhatsApp restoran.
* **Sistem Log Aktivitas (`/staff/admin/logs`)**: Rekaman riwayat aktivitas sistem (*audit trail*) untuk melacak tindakan penting yang dilakukan oleh admin atau staf (misal: "Admin A mengubah harga menu").
* **Monitoring Infrastruktur (`/staff/admin/infrastructure`)**: Memantau kesehatan koneksi server dan database utama.
