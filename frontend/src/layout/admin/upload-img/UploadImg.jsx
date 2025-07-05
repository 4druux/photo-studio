"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { useDropzone } from "react-dropzone";
import { canvasPreview } from "./canvasPreview";
import "react-image-crop/dist/ReactCrop.css";
import {
  UploadCloud,
  X,
  Scissors,
  Check,
  Image as ImageIcon,
  ChevronRight,
  FileImage,
  Tags,
  Trash2,
  Edit3,
  Save,
  Upload,
  Grid3X3,
} from "lucide-react";

// Helper function
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

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
  { label: "16:9", value: 16 / 9, icon: "📺" },
  { label: "1:1", value: 1 / 1, icon: "⬜" },
  { label: "4:5", value: 4 / 5, icon: "📱" },
  { label: "9:16", value: 9 / 16, icon: "📲" },
];

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

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const newImages = acceptedFiles.map((file) => ({
          original: URL.createObjectURL(file),
          name: file.name,
          id: `${file.name}-${Date.now()}`,
          categories: [],
        }));
        const wasEmpty = imageQueue.length === 0;
        setImageQueue((prevQueue) => [...prevQueue, ...newImages]);
        if (wasEmpty) {
          setActiveIndex(0);
        }
      }
    },
    [imageQueue.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const newCrop = centerAspectCrop(width, height, aspect);
    setCrop(newCrop);
    setCompletedCrop(newCrop);
  }

  function handleAspectChange(newAspect) {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, newAspect);
      setCrop(newCrop);
      setCompletedCrop(newCrop);
    }
  }

  function handleCategoryToggle(category) {
    setImageQueue((prevQueue) =>
      prevQueue.map((img, index) => {
        if (index === activeIndex) {
          const newCategories = img.categories.includes(category)
            ? img.categories.filter((c) => c !== category)
            : [...img.categories, category];
          return { ...img, categories: newCategories };
        }
        return img;
      })
    );
  }

  function handleRemoveFromQueue(indexToRemove) {
    setCroppedImages((prev) =>
      prev.filter((img) => img.name !== imageQueue[indexToRemove].name)
    );

    const newQueue = imageQueue.filter((_, index) => index !== indexToRemove);
    setImageQueue(newQueue);

    if (newQueue.length === 0) {
      setActiveIndex(-1);
      return;
    }

    if (indexToRemove === activeIndex) {
      const newIndex = Math.max(0, indexToRemove - 1);
      setActiveIndex(newIndex);
    } else if (indexToRemove < activeIndex) {
      setActiveIndex(activeIndex - 1);
    }
  }

  async function handleCropAndNext() {
    if (completedCrop && previewCanvasRef.current) {
      const currentImage = imageQueue[activeIndex];
      const dataUrl = previewCanvasRef.current.toDataURL("image/png");

      const otherCropped = croppedImages.filter(
        (img) => img.name !== currentImage.name
      );
      setCroppedImages([
        ...otherCropped,
        {
          src: dataUrl,
          name: currentImage.name,
          categories: currentImage.categories,
        },
      ]);

      const nextIndex = activeIndex + 1;
      if (nextIndex < imageQueue.length) {
        setActiveIndex(nextIndex);
      } else {
        setActiveIndex(-1);
      }
    }
  }

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

  const activeImage = imageQueue[activeIndex];

  if (activeIndex === -1) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
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
                      : "Pilih atau Seret Gambar"}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Anda bisa memilih banyak gambar sekaligus. Format yang
                    didukung: JPG, PNG, WebP
                  </p>
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <FileImage className="w-4 h-4 mr-2" />
                  Pilih File
                </div>
              </div>
            </div>

            {croppedImages.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Siap Upload ({croppedImages.length} gambar)
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  {croppedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={img.src}
                          alt="Cropped preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                          <p className="text-white text-xs font-medium mb-1">
                            {img.categories.length > 0
                              ? img.categories.join(", ")
                              : "Tanpa kategori"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <button
                    onClick={() => setActiveIndex(0)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-sky-600 bg-white border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Lagi
                  </button>
                  <button
                    onClick={handleUploadAll}
                    disabled={isUploading}
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengunggah...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Semua
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Scissors className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
                  Editor Gambar
                </h1>
                <p className="text-sm text-gray-500">
                  Potong & siapkan gambar ({croppedImages.length} /{" "}
                  {imageQueue.length})
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
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Main Editing Area */}
            <div className="xl:col-span-8 space-y-6">
              {/* Crop Area */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Scissors className="w-4 h-4 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Area Potong</h3>
                </div>
                <div className="bg-white rounded-lg p-2 border">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, p) => setCrop(p)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={activeImage.original}
                      onLoad={onImageLoad}
                      className="max-h-[50vh] w-auto mx-auto rounded"
                    />
                  </ReactCrop>
                </div>
              </div>

              {/* Preview Area */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <ImageIcon className="w-4 h-4 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Preview Hasil</h3>
                </div>
                <div className="bg-white rounded-lg p-4 border flex items-center justify-center min-h-[200px]">
                  {completedCrop ? (
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full max-h-[300px] rounded shadow-sm"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Preview akan muncul di sini</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="xl:col-span-4 space-y-6">
              {/* Aspect Ratio */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Grid3X3 className="w-4 h-4 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Aspect Ratio</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {imageRatios.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => handleAspectChange(r.value)}
                      className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        aspect === r.value
                          ? "bg-sky-500 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mr-2">{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Tags className="w-4 h-4 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Kategori</h3>
                </div>
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

              {/* Image Queue */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <FileImage className="w-4 h-4 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Antrean Gambar</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {imageQueue.map((img, index) => (
                    <div
                      key={img.id}
                      className={`relative group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        index === activeIndex
                          ? "bg-sky-100 border border-sky-200"
                          : "bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {croppedImages.some((ci) => ci.name === img.name) ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <FileImage className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {img.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {img.categories.length > 0
                            ? `${img.categories.length} kategori`
                            : "Belum ada kategori"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromQueue(index);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button
                onClick={() => {
                  setImageQueue([]);
                  setCroppedImages([]);
                  setActiveIndex(-1);
                }}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Batalkan Semua
              </button>
              <button
                onClick={handleCropAndNext}
                disabled={!completedCrop}
                className="flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg hover:from-sky-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {activeIndex === imageQueue.length - 1
                  ? "Selesai & Simpan"
                  : "Simpan & Lanjutkan"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}