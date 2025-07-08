// frontend/src/middleware.js

// Impor middleware bawaan dari next-auth
export { default } from "next-auth/middleware";

// Tentukan rute mana yang ingin Anda lindungi
export const config = {
  matcher: [
    /*
     * Cocokkan semua path rute kecuali untuk file static dan API routes:
     * - api (API routes)
     * - _next/static (file static)
     * - _next/image (file optimasi gambar)
     * - favicon.ico (file ikon)
     *
     * Ini akan melindungi semua halaman di dalam folder /admin
     */
    "/admin/:path*",
  ],
};
