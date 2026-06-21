# Toko Online Frontend

Proyek ini adalah *frontend* dari aplikasi Toko Online yang dibangun menggunakan React dan Vite.

## Setup Environment Variables (Untuk Clone dari GitHub)

Sebelum menjalankan aplikasi, Anda perlu mengatur *environment variables* (variabel lingkungan) terlebih dahulu. Karena file `.env` biasanya tidak ikut di-*commit* ke GitHub (di-*ignore*), Anda harus membuatnya secara manual di komputer Anda.

1. **Buat file `.env` baru** di *root* (folder utama) proyek ini.
2. Anda bisa menyalin format dari file `.env.example` (jika ada) atau langsung mengisi dengan variabel berikut:

```env
VITE_API_BASE_URL='http://127.0.0.1:8000/api'
```

*Catatan: Pastikan `VITE_API_BASE_URL` mengarah ke endpoint backend Laravel/API Anda.*

## Menjalankan Aplikasi

Setelah `.env` dibuat dan dependensi telah diinstal (`npm install`), Anda bisa menjalankan server lokal dengan:

```bash
npm run dev
```

---

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
