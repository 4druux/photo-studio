"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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
  Tags,
  FileImage,
  Trash2,
} from "lucide-react";

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

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

const ImageDropzone = ({ getRootProps, getInputProps, isDragActive }) => (
  <div className="w-full max-w-4xl mx-auto p-4 lg:p-0">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4">
        Upload Gambar Galeri
      </h1>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full py-16 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          isDragActive
            ? "border-sky-500 bg-sky-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-700">
          Pilih atau Seret Gambar ke Sini
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Anda bisa memilih banyak gambar sekaligus
        </p>
      </div>
    </div>
  </div>
);

const CroppedGallery = ({ croppedImages, onEdit, onUpload, isUploading }) => (
  <div className="w-full p-4 lg:p-0">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4">
        Selesai di-crop ({croppedImages.length} gambar)
      </h1>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
        {croppedImages.map((img) => (
          <div key={img.id} className="relative group aspect-square">
            <img
              src={img.src}
              alt="Cropped"
              className="w-full h-full object-cover rounded-lg shadow-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-xs text-center p-1">
                {img.categories.join(", ") || "No Category"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center mt-8 lg:mt-12 gap-4">
        <button
          onClick={onEdit}
          className="px-6 py-3 border border-sky-600 text-sky-500 text-sm font-semibold rounded-full hover:bg-sky-600 hover:text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Edit lagi
        </button>
        <button
          onClick={onUpload}
          disabled={isUploading}
          className="px-6 py-3 bg-sky-500 text-white text-sm font-semibold rounded-full hover:bg-sky-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isUploading ? "Mengunggah..." : "Upload Semua"}
        </button>
      </div>
    </div>
  </div>
);

export default function UploadImg() {
  const router = useRouter();
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
      prev.filter((img) => img.id !== imageQueue[indexToRemove].id)
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
        ...prev.filter((img) => img.id !== activeImage.id),
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
        setActiveIndex(-1);
      }
    }
  };

  function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
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
      toast.error("Tidak ada gambar untuk di-upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();

    croppedImages.forEach((image) => {
      const file = dataURLtoFile(image.src, image.name);
      formData.append("images", file);
      formData.append("categories", JSON.stringify(image.categories));
    });

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

      toast.success(result.message || "Semua gambar berhasil di-upload!", {
        className: "custom-toast",
      });

      router.push("/admin/kelola-galeri");
    } catch (error) {
      console.error("Error saat upload:", error);
      toast.error(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
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
    return <div className="text-center p-10">Memuat...</div>;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen lg:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow lg:w-2/3">
          <div className="p-6 bg-white lg:rounded-2xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="space-y-4">
                <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4">
                  Potong Gambar ({activeIndex + 1}/{imageQueue.length})
                </h1>
                <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center p-2">
                  <ReactCrop
                    crop={crop}
                    onChange={(pixelCrop, percentCrop) => {
                      setCrop(percentCrop);
                      setCompletedCrop(pixelCrop);
                    }}
                    aspect={aspect}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop area"
                      src={activeImage.original}
                      onLoad={onImageLoad}
                      style={{
                        display: "block",
                        maxHeight: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4">
                  Preview
                </h1>
                <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center p-2">
                  {completedCrop?.width ? (
                    <canvas
                      ref={previewCanvasRef}
                      className="rounded-lg shadow-inner"
                      style={{
                        aspectRatio: aspect,
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-400">
                      <p>Arahkan area potong</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 flex-shrink-0">
          <div className="p-6 bg-white lg:rounded-2xl shadow-sm border border-gray-200 space-y-8 h-full flex flex-col">
            <div>
              <label className="text-md font-semibold text-gray-700 flex items-center mb-3">
                <Scissors size={18} className="mr-2 text-gray-500" /> Pilih
                Rasio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {imageRatios.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleAspectChange(r.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
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
              <label className="text-md font-semibold text-gray-700 flex items-center mb-3">
                <Tags size={18} className="mr-2 text-gray-500" /> Pilih Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {photoCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      activeImage.categories.includes(cat)
                        ? "bg-sky-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col flex-grow min-h-0">
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                Antrean
              </h3>
              <div className="space-y-2 overflow-y-auto p-2 flex-grow">
                {imageQueue.map((img, index) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveIndex(index)}
                    className={`flex items-center p-1 rounded-lg cursor-pointer transition-colors group ${
                      index === activeIndex
                        ? "bg-sky-100 ring-2 ring-sky-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 mr-3">
                      {croppedImages.find((ci) => ci.id === img.id) ? (
                        <img
                          src={croppedImages.find((ci) => ci.id === img.id).src}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <FileImage className="w-full h-full text-gray-300 p-1" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800 truncate flex-grow">
                      {img.name}
                    </span>
                    {croppedImages.find((ci) => ci.id === img.id) && (
                      <Check
                        size={20}
                        className="text-green-500 mx-2 flex-shrink-0"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromQueue(index);
                      }}
                      className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleCropAndNext}
                disabled={!completedCrop}
                className="w-full py-3 bg-sky-500 text-white text-sm font-semibold rounded-full hover:bg-sky-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
  );
}
