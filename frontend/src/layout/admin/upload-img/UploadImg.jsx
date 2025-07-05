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
  { label: "Landscape (16:9)", value: 16 / 9 },
  { label: "Square (1:1)", value: 1 / 1 },
  { label: "Portrait (4:5)", value: 4 / 5 },
  { label: "Tall (9:16)", value: 9 / 16 },
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
      <div className="p-0 lg:p-8">
        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-md">
          <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4 border-b pb-3">
            Upload Gambar Galeri
          </h1>
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center w-full py-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive
                ? "border-sky-500 bg-sky-50"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="text-sm lg:text-base mt-4 font-medium text-gray-700">
              Pilih atau Seret Gambar ke Sini
            </h2>
            <p className="mt-1 text-xs lg:text-sm text-gray-500">
              Anda bisa memilih banyak gambar sekaligus.
            </p>
          </div>
          {croppedImages.length > 0 && (
            <div className="mt-6">
              <h2 className="text-md font-semibold text-gray-600 mb-2">
                Selesai di-crop ({croppedImages.length} gambar)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {croppedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.src}
                      alt="Cropped"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate invisible group-hover:visible">
                      {img.categories.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    setActiveIndex(0);
                  }}
                  className="text-sm text-sky-600 hover:underline"
                >
                  Edit lagi
                </button>
                <button
                  onClick={handleUploadAll}
                  disabled={isUploading}
                  className="px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-400"
                >
                  {isUploading ? "Mengunggah..." : "Upload Semua"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 lg:p-8">
      <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-md">
        <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4 border-b pb-3">
          Potong & Siapkan Gambar{" "}
          <span className="text-sm lg:text-base">
            ({croppedImages.length} / {imageQueue.length})
          </span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="w-full">
              <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <Scissors className="w-4 h-4 mr-2" />
                Area Potong
              </label>
              <ReactCrop
                crop={crop}
                onChange={(_, p) => setCrop(p)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="rounded-lg overflow-hidden border"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={activeImage.original}
                  onLoad={onImageLoad}
                  style={{ maxHeight: "65vh" }}
                />
              </ReactCrop>
            </div>
            <div className="w-full">
              <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Preview Hasil
              </label>
              <div
                className="p-2 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: aspect, maxHeight: "65vh" }}
              >
                {completedCrop ? (
                  <canvas
                    ref={previewCanvasRef}
                    className="max-w-full max-h-full rounded"
                  />
                ) : (
                  <p className="text-xs text-gray-400">
                    Preview akan muncul di sini
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2">
                1. Pilih Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-2">
                {imageRatios.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleAspectChange(r.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      aspect === r.value
                        ? "bg-sky-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <Tags className="w-4 h-4 mr-2" />
                2. Pilih Kategori
              </label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-gray-50">
                {photoCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      activeImage.categories.includes(cat)
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-600 border hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-md font-semibold text-gray-600 mb-2">
                3. Antrean Gambar
              </h2>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 border rounded-lg p-2 bg-gray-50">
                {imageQueue.map((img, index) => (
                  <div
                    key={img.id}
                    className={`relative group flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      index === activeIndex ? "bg-sky-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {croppedImages.some((ci) => ci.name === img.name) ? (
                      <Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <FileImage className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-800 truncate">
                      {img.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromQueue(index);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <button
            onClick={() => {
              setImageQueue([]);
              setCroppedImages([]);
              setActiveIndex(-1);
            }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <X className="w-4 h-4 mr-2" />
            Batalkan Semua
          </button>
          <button
            onClick={handleCropAndNext}
            disabled={!completedCrop}
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-gray-300"
          >
            {activeIndex === imageQueue.length - 1
              ? "Selesai & Simpan"
              : "Simpan & Lanjutkan"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
