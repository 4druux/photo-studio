"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { useDropzone } from "react-dropzone";
import { canvasPreview } from "./canvasPreview"; // Pastikan file ini ada
import "react-image-crop/dist/ReactCrop.css";
import {
  UploadCloud,
  X,
  Scissors,
  Check,
  Image as ImageIcon,
  Tags,
  FileImage,
  Trash2,
} from "lucide-react";

// Konfigurasi dan Data
const photoCategories = [
  "Couple",
  "Family",
  "Group",
  "Graduation",
  "Maternity",
  "Pass Foto",
  "Pre-Wedding",
  "Produk",
  "Ulang Tahun",
  "Session",
  "Post Wedding",
  "Foto OOTD",
  "Foto Lain",
];
const imageRatios = [
  { label: "Landscape", value: 16 / 9 },
  { label: "Square", value: 1 / 1 },
  { label: "Portrait", value: 4 / 5 },
  { label: "Tall", value: 9 / 16 },
];

// Helper Function
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

// =================================================================
// 1. SUB-KOMPONEN: Initial Dropzone View
// =================================================================
const ImageDropzone = ({ getRootProps, getInputProps, isDragActive }) => (
  <div className="p-4 lg:p-8">
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <UploadCloud className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
              Upload Gambar Galeri
            </h1>
            <p className="text-sm text-gray-500">
              Kelola dan upload gambar untuk galeri studio
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center w-full py-16 lg:py-20 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-sky-500 bg-sky-50 scale-[1.02]"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-sky-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {isDragActive
                  ? "Lepaskan file di sini"
                  : "Pilih atau Seret Gambar ke Sini"}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Anda bisa memilih banyak gambar sekaligus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =================================================================
// 2. SUB-KOMPONEN: Finished Cropped Images View
// =================================================================
const CroppedGallery = ({ croppedImages, onEdit, onUpload, isUploading }) => (
  <div className="p-4 lg:p-8">
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
              Selesai di-crop ({croppedImages.length} gambar)
            </h2>
            <p className="text-sm text-gray-500">
              Gambar siap untuk diupload ke galeri
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {croppedImages.map((img) => (
            <div key={img.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={img.src}
                  alt="Cropped"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-white text-xs font-medium px-2">
                    {img.categories.join(", ") || "No Category"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-4 bg-gray-50 rounded-xl">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-sky-600 bg-white border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
          >
            Edit lagi
          </button>
          <button
            onClick={onUpload}
            disabled={isUploading}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isUploading ? "Mengunggah..." : "Upload Semua"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// =================================================================
// 3. KOMPONEN UTAMA: UploadImg
// =================================================================
export default function UploadImg() {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspect, setAspect] = useState(16 / 9);

  const [imageQueue, setImageQueue] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isUploading, setIsUploading] = useState(false);

  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const activeImage = activeIndex >= 0 ? imageQueue[activeIndex] : null;

  // --- LOGIC & HANDLERS ---
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const newImages = acceptedFiles.map((file) => ({
          original: URL.createObjectURL(file),
          name: file.name,
          id: `${file.name}-${Date.now()}`,
          categories: [],
        }));
        setImageQueue((prev) => [...prev, ...newImages]);
        if (activeIndex === -1) {
          setActiveIndex(0);
        }
      }
    },
    [activeIndex]
  );

  const onImageLoad = useCallback(
    (e) => {
      if (e.currentTarget.src !== activeImage?.original) return;
      const { width, height } = e.currentTarget;
      const newCrop = centerAspectCrop(width, height, aspect);
      setCrop(newCrop);
    },
    [aspect, activeImage]
  );

  function handleAspectChange(newAspect) {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, newAspect);
      setCrop(newCrop);
    }
  }

  const handleCategoryToggle = (category) => {
    setImageQueue((prev) =>
      prev.map((img, index) => {
        if (index === activeIndex) {
          const newCategories = img.categories.includes(category)
            ? img.categories.filter((c) => c !== category)
            : [...img.categories, category];
          return { ...img, categories: newCategories };
        }
        return img;
      })
    );
  };

  const handleRemoveFromQueue = (indexToRemove) => {
    const newQueue = imageQueue.filter((_, index) => index !== indexToRemove);
    setImageQueue(newQueue);
    setCroppedImages((prev) =>
      prev.filter((img) => img.name !== imageQueue[indexToRemove].name)
    );
    if (newQueue.length === 0) {
      setActiveIndex(-1);
      return;
    }
    if (indexToRemove < activeIndex) {
      setActiveIndex((prev) => prev - 1);
    } else if (indexToRemove === activeIndex) {
      setActiveIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleCropAndNext = async () => {
    if (
      completedCrop &&
      previewCanvasRef.current &&
      imgRef.current &&
      activeImage
    ) {
      await canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop
      );
      const dataUrl = previewCanvasRef.current.toDataURL("image/png");

      setCroppedImages((prev) => [
        ...prev.filter((img) => img.name !== activeImage.name),
        {
          src: dataUrl,
          name: activeImage.name,
          categories: activeImage.categories,
          id: activeImage.id,
        },
      ]);

      if (activeIndex < imageQueue.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else {
        setActiveIndex(-1); // Selesai, kembali ke galeri
      }
    }
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  async function handleUploadAll() {
    if (croppedImages.length === 0) {
      alert("Tidak ada gambar untuk di-upload.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();

    for (const image of croppedImages) {
      const file = dataURLtoFile(image.src, image.name);
      formData.append("images", file);
      formData.append("categories", JSON.stringify(image.categories));
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal meng-upload gambar.");
      }

      const result = await response.json();

      alert(result.message || "Semua gambar berhasil di-upload!");
      console.log("Respon server:", result);

      setCroppedImages([]);
      setImageQueue([]);
      setActiveIndex(-1);
    } catch (error) {
      console.error("Error saat upload:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }

  // --- EFFECTS ---
  useEffect(() => {
    // Reset crop state when active image changes to prevent using stale data
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [activeIndex]);

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  // --- RENDER LOGIC ---
  if (imageQueue.length === 0) {
    return (
      <ImageDropzone
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />
    );
  }

  if (activeIndex === -1 && croppedImages.length > 0) {
    return (
      <CroppedGallery
        croppedImages={croppedImages}
        onEdit={() => setActiveIndex(0)}
        onUpload={handleUploadAll}
        isUploading={isUploading}
      />
    );
  }

  if (!activeImage) {
    return <div className="text-center p-10">Memuat...</div>; // Fallback
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Scissors className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
                  Potong & Siapkan Gambar
                </h1>
                <p className="text-sm text-gray-500">
                  ({activeIndex + 1}/{imageQueue.length}) - {croppedImages.length} selesai
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                Selesai: {croppedImages.length}
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                Tersisa: {imageQueue.length - croppedImages.length}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* --- Kolom 1: Area Potong --- */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Scissors className="w-4 h-4 text-gray-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Area Potong
                    </h2>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="bg-white rounded-lg p-2 border">
                      <ReactCrop
                        crop={crop}
                        onChange={(pixelCrop, percentCrop) => {
                          setCrop(percentCrop);
                          setCompletedCrop(pixelCrop);
                        }}
                        aspect={aspect}
                        className="max-w-full"
                      >
                        <img
                          ref={imgRef}
                          alt="Crop area"
                          src={activeImage.original}
                          onLoad={onImageLoad}
                          className="max-h-[40vh] w-auto mx-auto rounded"
                        />
                      </ReactCrop>
                    </div>
                  </div>
                </div>

                {/* --- Kolom 2: Preview Hasil --- */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ImageIcon className="w-4 h-4 text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Preview
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="bg-white rounded-lg p-4 border flex items-center justify-center min-h-[200px]">
                      {completedCrop?.width ? (
                        <canvas
                          ref={previewCanvasRef}
                          className="max-w-full max-h-[40vh] rounded shadow-sm"
                          style={{
                            aspectRatio: aspect,
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Arahkan area potong</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================================== */}
            {/* KARTU UTAMA KANAN: Sidebar Kontrol (Semua jadi satu)             */}
            {/* ==================================================================== */}
            <div className="lg:w-1/3 flex-shrink-0">
              <div className="bg-gray-50 rounded-xl p-4 space-y-6 h-full flex flex-col">
                {/* --- Kontrol Rasio --- */}
                <div>
                  <label className="text-md font-semibold text-gray-700 flex items-center mb-3">
                    <Scissors size={18} className="mr-2 text-gray-500" /> 1.
                    Pilih Rasio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {imageRatios.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => handleAspectChange(r.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          aspect === r.value
                            ? "bg-sky-500 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* --- Kontrol Kategori --- */}
                <div>
                  <label className="text-md font-semibold text-gray-700 flex items-center mb-3">
                    <Tags size={18} className="mr-2 text-gray-500" /> 2. Pilih
                    Kategori
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {photoCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                          activeImage.categories.includes(cat)
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* --- Antrean Gambar --- */}
                <div className="flex flex-col flex-grow min-h-0">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">
                    3. Antrean
                  </h3>
                  <div className="space-y-2 overflow-y-auto px-2 flex-grow">
                    {imageQueue.map((img, index) => (
                      <div
                        key={img.id}
                        onClick={() => setActiveIndex(index)}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors group ${
                          index === activeIndex
                            ? "bg-sky-100 ring-2 ring-sky-500"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 mr-3">
                          {croppedImages.find((ci) => ci.id === img.id) ? (
                            <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                              <FileImage className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-800 truncate block">
                            {img.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {img.categories.length > 0
                              ? `${img.categories.length} kategori`
                              : "Belum ada kategori"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromQueue(index);
                          }}
                          className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- Tombol Aksi --- */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCropAndNext}
                    disabled={!completedCrop}
                    className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {activeIndex === imageQueue.length - 1
                      ? "Selesai & Lihat Galeri"
                      : "Simpan & Lanjutkan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}