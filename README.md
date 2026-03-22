Sistem Manajemen Inventaris & Pesanan Meubel
Aplikasi manajemen operasional meubel untuk mencatat stok furnitur, kategori material (Jati, Mahoni, dll), hingga pengelolaan pesanan pelanggan. Dibangun dengan arsitektur Decoupled menggunakan Laravel sebagai API Engine dan React.js sebagai Dashboard Admin.

✨ Fitur Utama
📦 Inventory Management: Monitoring stok barang (Kursi, Meja, Lemari) secara real-time.

🪵 Material Tracking: Klasifikasi produk berdasarkan jenis kayu dan kualitas finishing.

🛒 Order System: Pencatatan pesanan pelanggan, status produksi, hingga riwayat pembayaran.

🖼️ Image Gallery: Integrasi upload foto produk untuk katalog digital.

🔐 Role-Based Access: Pembedaan akses antara Admin (Owner) dan Staf Produksi.

🛠️ Tech Stack
Backend (API)
Framework: Laravel 11

Database: MySQL

Storage: Laravel File Storage (untuk foto produk)

Frontend (UI)
Library: React.js (Vite)

Styling: Tailwind CSS + Headless UI

HTTP Client: Axios

🚀 Panduan Instalasi & Run Project
Ikuti langkah-langkah berikut secara berurutan untuk menjalankan aplikasi di komputer Anda:

1. Persiapan Awal
Pastikan Anda sudah menginstal PHP >= 8.2, Composer, Node.js (NPM), dan MySQL (XAMPP/Laragon).

2. Setup Backend (API Meubel)
Buka terminal dan jalankan perintah berikut:

Bash
# Clone repository
git clone https://github.com/RayanHakim/meubel-app.git
cd meubel-app/backend-api

# Install dependensi & konfigurasi
composer install
cp .env.example .env
php artisan key:generate

# Konfigurasi Database
# Buka file .env, sesuaikan DB_DATABASE dengan nama database meubel Anda.

# Migrasi & Link Storage (Penting untuk Foto)
php artisan migrate
php artisan storage:link

# Jalankan Server Backend
php artisan serve
Backend kini berjalan di: http://127.0.0.1:8000

3. Setup Frontend (Dashboard React)
Buka terminal baru (jangan tutup terminal backend), lalu jalankan:

Bash
# Pindah ke folder frontend
cd ../frontend-react

# Install dependensi & setup API URL
npm install
echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env

# Jalankan Aplikasi React
npm run dev
Frontend kini berjalan di: http://localhost:5173

📂 Struktur Direktori
Plaintext
/meubel-app
  ├── /backend-api     <-- CRUD Produk, Order, & Auth (Laravel)
  ├── /frontend-react  <-- Dashboard Admin & Katalog (React)
  └── README.md
