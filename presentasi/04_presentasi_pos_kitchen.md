# 👨‍🍳 Materi Presentasi Teman 3: Panel Kasir (POS), Dapur (Kanban), & Keamanan Client

Dokumen ini berisi materi presentasi untuk **Teman 3**. Materi ini berfokus pada **sisi Operasional Restoran (Cashier POS & Kitchen Kanban)**, integrasi komunikasi data secara real-time via WebSockets, serta aturan keamanan navigasi (Router Guard) pada sisi frontend.

---

## 🏦 Deskripsi Umum Operasional & Keamanan Frontend

Alur kerja harian restoran didukung penuh oleh dua panel operasional utama: Panel Kasir (POS) dan Panel Dapur (Kitchen). Panel Dapur mempermudah koki melihat pesanan masuk menggunakan metode Kanban Board, sedangkan Panel Kasir memproses transaksi pembayaran secara efisien menggunakan antarmuka Point of Sale. Agar operasional berjalan mulus, frontend dilengkapi sistem **real-time update** menggunakan WebSockets, sehingga status pesanan berubah secara instan di layar kasir, dapur, maupun pelanggan tanpa perlu memuat ulang halaman. Seluruh akses ini dilindungi oleh aturan keamanan navigasi yang ketat di tingkat frontend.

---

## 🎯 Poin-Poin Fitur & Penjelasan Teknis

Berikut adalah detail fitur yang perlu dipresentasikan:

### 1. Panel Dapur / Kitchen Kanban Board (`/staff/kitchen`)
*Sistem antrean pesanan masak bagi staf koki di dapur.*
* **Tampilan Papan Kanban (Kanban Layout)**: Layout kolom-kolom status pesanan yang teratur secara real-time untuk membagi pesanan baru, pesanan sedang dimasak, dan pesanan yang sudah selesai dibuat.
* **Detail Tiket Dapur**: Kartu pesanan menampilkan nama menu, jumlah porsi, serta catatan kustom dari pelanggan (seperti "level 5 pedas", "tanpa MSG") secara jelas.
* **Tombol Aksi Status**: Tombol instan untuk memperbarui status memasak dengan satu klik: `Mulai Masak` ➔ `Siap Diambil` (mengirim sinyal otomatis ke pelanggan dan kasir).
* **Tema Gelap Khusus (Dark Mode)**: Skema warna gelap yang didesain khusus agar nyaman di mata koki saat bekerja di area dapur yang panas dan berpencahayaan kontras.

### 2. Panel Kasir / Point of Sale (`/staff/cashier`)
*Sistem kasir digital terpadu untuk penyelesaian pembayaran pelanggan.*
* **Antarmuka POS Terpadu**: Menampilkan daftar seluruh meja/pesanan yang telah selesai dimasak oleh dapur dan siap untuk dibayar.
* **Kalkulator Pembayaran & Kembalian**: Kolom input jumlah uang tunai yang diterima, yang secara otomatis menghitung kembalian pelanggan secara presisi.
* **Metode Pembayaran**: Memilih metode penyelesaian transaksi seperti Tunai, Transfer Bank, atau Dompet Digital.
* **Cetak Struk Instan (Print-js)**: Integrasi dengan library `print-js` untuk mencetak struk transaksi kertas fisik ke printer kasir langsung dari browser.
* **Riwayat Transaksi Harian**: Laporan singkat seluruh transaksi kasir yang sukses diselesaikan hari ini.

### 3. Keamanan Navigasi Frontend (Router Guard)
*Aturan ketat untuk mengamankan halaman internal staff dari akses ilegal.*
* **Proteksi Jalur Staf**: Seluruh rute URL yang diawali dengan `/staff` dilindungi oleh pemeriksaan token JWT (`isAuthenticated` dan `isStaff`). Staf atau pelanggan biasa tidak akan bisa membuka halaman ini tanpa login yang valid.
* **Isolasi Peran (Role Isolation)**: Mencegah staf mengakses panel di luar wewenangnya (misalnya: akun koki dapur mencoba membuka halaman kasir atau halaman admin). Sistem akan mendeteksi peran dalam token JWT dan mengarahkan paksa (*auto-redirect*) kembali ke portal masing-masing.
* **Login Auto-Redirect**: Jika seorang staf yang sudah login mencoba membuka kembali halaman login, sistem secara cerdas akan langsung memindahkan mereka kembali ke dasbor portal masing-masing.

### 4. Komunikasi Real-time (WebSocket / Socket.io)
*Sinkronisasi data instan antar perangkat.*
* **Sinkronisasi Otomatis**: Saat pelanggan mengklik tombol "Pesan", pesanan langsung muncul di panel dapur dan panel kasir secara instan dalam hitungan milidetik.
* **Tanpa Muat Ulang (Zero Refresh)**: Semua perubahan status pesanan didorong langsung oleh server ke frontend (*push notification*) menggunakan protokol WebSockets, menghilangkan kebutuhan pengguna untuk menekan tombol refresh browser secara berulang kali.
