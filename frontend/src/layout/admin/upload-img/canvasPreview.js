/**
 * Fungsi ini menggambar pratinjau hasil potong ke elemen canvas.
 * Metode ini memastikan tidak ada distorsi dengan cara:
 * 1. Menghitung area sumber (source) dari gambar asli dengan tepat.
 * 2. Membuat bitmap canvas dengan resolusi dan aspek rasio yang SAMA PERSIS dengan area sumber.
 * 3. Menggambar area sumber tersebut untuk mengisi seluruh canvas.
 *
 * @param {HTMLImageElement} image - Elemen <img> yang sedang ditampilkan.
 * @param {HTMLCanvasElement} canvas - Elemen <canvas> untuk pratinjau.
 * @param {import('react-image-crop').PixelCrop} crop - Objek hasil potong dalam satuan PIXEL.
 */
export async function canvasPreview(image, canvas, crop) {
  const ctx = canvas.getContext("2d");

  if (!ctx || !crop.width || !crop.height) {
    // Keluar jika tidak ada konteks atau area potong tidak valid.
    return;
  }

  // Faktor skala untuk konversi dari ukuran gambar di layar ke ukuran gambar asli.
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Ambil pixel ratio perangkat untuk hasil yang tajam (penting untuk layar Retina/HiDPI).
  const pixelRatio = window.devicePixelRatio || 1;

  // --- BAGIAN KUNCI 1: UKURAN BITMAP CANVAS ---
  // Ukuran bitmap harus sama dengan ukuran area potong di gambar asli, dikali pixelRatio.
  // Ini memastikan aspek rasio canvas sama dengan aspek rasio potongan, mencegah distorsi.
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  // Sesuaikan skala sistem koordinat canvas agar gambar tidak blur di layar HiDPI.
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  // --- BAGIAN KUNCI 2: AREA SUMBER & TUJUAN ---
  // Definisikan area sumber (source) yang akan kita 'salin' dari gambar asli.
  const sourceX = crop.x * scaleX;
  const sourceY = crop.y * scaleY;
  const sourceWidth = crop.width * scaleX;
  const sourceHeight = crop.height * scaleY;

  // Bersihkan canvas sebelum menggambar ulang.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar potongan dari gambar asli ke canvas.
  // Kita menggambar 'source' untuk mengisi seluruh canvas 'destination'.
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0, // x tujuan di canvas
    0, // y tujuan di canvas
    canvas.width / pixelRatio, // lebar tujuan di canvas (sesuai logika skala)
    canvas.height / pixelRatio // tinggi tujuan di canvas (sesuai logika skala)
  );
}
