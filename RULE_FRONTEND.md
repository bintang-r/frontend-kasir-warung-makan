# 📌 Frontend Specification (Vue.js)

Sistem Informasi Pemesanan Menu + Chatbot + QR Table

---

## 🎯 1. Tujuan Frontend

Membangun aplikasi frontend berbasis Vue.js yang:

- Modern & responsif (mobile-first)
- Mendukung pemesanan via:
  - UI (manual)
  - Chatbot
  - QR Code (tanpa login)
- Real-time (status order)
- UX cepat & minimal klik

---

## ⚙️ 2. Teknologi yang Digunakan

### 🧩 Core

- Vue 3 (Composition API)
- Vite
- Vue Router
- Pinia (state management)

### 🎨 UI / Styling

- Tailwind CSS
- Headless UI / ShadCN Vue (opsional)
- Icon: Heroicons / Lucide

### 🌐 API & Realtime

- Axios (HTTP client)
- Laravel API (backend kamu)
- WebSocket / Pusher (opsional realtime)

### 🤖 Chatbot

- Web chat widget
- Integrasi API chatbot (backend / WhatsApp bridge)

### 📱 Mobile Friendly

- PWA (Progressive Web App)
- Responsive design

---

## 🧠 3. Konsep UX

- Clean minimal (seperti GoFood / GrabFood)
- Fast interaction (≤ 3 klik untuk order)
- Fokus gambar menu
- CTA jelas (Tambah / Checkout)
- Sticky cart di bawah
- Floating chatbot button

---

## 🎨 4. Design System

### 🌈 Warna

- Primary: Merah / Oranye (tema rumah makan)
- Secondary: Putih / Abu
- Accent: Hijau (success)

### 🔤 Font

- Inter / Poppins

### 📐 Komponen Umum

- Card Menu
- Button Primary / Secondary
- Modal
- Toast Notification
- Bottom Navigation (mobile)

---

### 🧩 5. Struktur Folder

```
src/
│
├── assets/
│   └── images/   # (gambar nanti kamu isi)
│
├── components/
│   ├── ui/
│   ├── menu/
│   ├── cart/
│   ├── chatbot/
│   └── layout/
│
├── views/
│   ├── Home.vue
│   ├── Menu.vue
│   ├── Cart.vue
│   ├── Checkout.vue
│   ├── OrderStatus.vue
│   ├── Login.vue
│   └── QRSession.vue
│
├── stores/
│   ├── auth.js
│   ├── cart.js
│   ├── order.js
│
├── services/
│   └── api.js
│
├── router/
│   └── index.js
```

---

## 📱 6. Halaman Utama (Pages)

### 🏠 Home

- Banner restoran
- Kategori menu
  Best seller

### 🍽️ Menu

- List menu (grid)
- Filter kategori
- Search bar

### 🛒 Cart

- List item
- Edit qty
- Total harga

### 💳 Checkout

- Pilih metode:
- dine-in (QR)
- delivery
- Input alamat
- Pilih pembayaran

### 📦 Order Status

- Timeline:
- pending
- cooking
- ready
- selesai

### 🔐 Login

- Email / password
- Google login (opsional)

### 🪑 QR Session

- Detect table_id
- Auto masuk menu
- No login

---

## 🧩 7. Komponen Penting

### 🍛 MenuCard.vue

- Gambar menu
- Nama
- Harga
- Button “Tambah”

### 🛒 CartDrawer.vue

- Sticky bottom cart
- Total harga
- Checkout button

### 🤖 ChatbotWidget.vue

- Floating button
- Chat window
- Input message

### 🔔 NotificationToast.vue

- Success / error message

---

## 🤖 8. Integrasi Chatbot (Frontend)

UI:

- Floating button kanan bawah
- Popup chat

Flow:

1. User klik chatbot
2. Ketik pesan
3. Kirim ke API
4. Tampilkan response

---

## 🪑 9. Flow QR Code (Frontend)

Saat scan:

- URL contoh:
  `/qr?table_id=5`

Flow:

- Ambil table_id dari URL
- Simpan ke state (Pinia)

Set mode:

- isGuest = true
- Redirect ke menu
