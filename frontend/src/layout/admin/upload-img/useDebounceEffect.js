import { useEffect } from "react";

/**
 * Hook kustom untuk menunda (debounce) eksekusi sebuah fungsi.
 * Ini sangat berguna untuk operasi yang sering dipicu seperti resize, scroll, atau input,
 * termasuk menggambar canvas saat user melakukan dragging.
 *
 * @param {Function} fn - Fungsi yang akan dieksekusi setelah waktu tunda.
 * @param {number} waitTime - Waktu tunda dalam milidetik.
 * @param {Array<any>} deps - Array dependensi, sama seperti pada useEffect.
 */
export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    // Set timer saat dependensi berubah.
    const t = setTimeout(() => {
      fn();
    }, waitTime);

    // Bersihkan timer jika komponen unmount atau dependensi berubah lagi
    // sebelum timer selesai. Ini adalah bagian penting dari debounce.
    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
