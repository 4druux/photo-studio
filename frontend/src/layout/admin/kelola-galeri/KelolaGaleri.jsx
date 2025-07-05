"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import DotLoader from "@/components/loading/dotloader";

const fetcher = (url) => fetch(url).then((res) => res.json());

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * Fungsi untuk menentukan ukuran span grid berdasarkan rasio aspek gambar.
 * @param {number | undefined} aspectRatio - Rasio aspek gambar (width / height).
 * @returns {string} String kelas Tailwind CSS untuk col-span dan row-span.
 */
const getGridSpan = (aspectRatio) => {
  // Fallback untuk memastikan kode tidak error jika aspectRatio tidak ada.
  if (typeof aspectRatio !== 'number' || !aspectRatio) {
    return "col-span-1 md:col-span-1 md:row-span-1";
  }

  // Landscape (Lebar)
  if (aspectRatio > 1.4) { // Contoh: 16/9 = 1.77
    return "col-span-2 md:col-span-2 md:row-span-1";
  }
  // Tall (Tinggi)
  if (aspectRatio < 0.7) { // Contoh: 9/16 = 0.56
    return "col-span-1 md:col-span-1 md:row-span-2";
  }
  // Portrait (Sedikit Tinggi)
  if (aspectRatio < 0.9) { // Contoh: 4/5 = 0.8
    return "col-span-1 md:col-span-1 md:row-span-2";
  }
  // Square atau mendekati square
  return "col-span-1 md:col-span-1 md:row-span-1";
};


export default function KelolaGaleri() {
  const { data, error, isLoading } = useSWR("/api/gallery", fetcher);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { mutate } = useSWRConfig();

  const handleDelete = async (filename) => {
    // Mengganti confirm() bawaan dengan modal kustom atau toast konfirmasi
    // untuk pengalaman pengguna yang lebih baik di aplikasi modern.
    const confirmed = await new Promise((resolve) => {
        toast(
            (t) => (
                <div className="flex flex-col items-center gap-4">
                    <span className="text-center">
                        Yakin ingin menghapus <b>{filename}</b>?
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                resolve(true);
                            }}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
                        >
                            Ya, Hapus
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                resolve(false);
                            }}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ),
            { duration: 6000 }
        );
    });

    if (!confirmed) {
        return;
    }

    try {
      const response = await fetch(`/api/gallery/${filename}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Gagal menghapus gambar. Status: ${response.status}`;
        const responseForText = response.clone();
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const errorText = await responseForText.text();
          console.error(
            "Respon dari server bukan JSON. Isi respon:",
            errorText
          );
          errorMessage = `Gagal menghapus gambar. Server tidak memberikan respon yang valid.`;
        }
        throw new Error(errorMessage);
      }

      toast.success("Gambar berhasil dihapus!");
      mutate("/api/gallery");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat data galeri. Pastikan API Anda sudah mengirim `aspectRatio`.
      </div>
    );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <DotLoader text="Memuat gambar..." />
      </div>
    );

  // Fallback jika data tidak ada atau formatnya salah
  if (!data || !data.images) {
      return (
          <div className="p-8 text-center text-gray-500">
              Tidak ada data gambar yang ditemukan.
          </div>
      );
  }

  const { images, categories } = data;
  const allCategories = ["All", ...categories];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((image) => image.categories && image.categories.includes(selectedCategory));

  return (
    <div className="p-0 lg:p-8">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md">
        <h1 className="text-md lg:text-lg font-semibold text-gray-600 mb-4 border-b pb-3">
          Kelola Galeri{" "}
          <span className="text-sm lg:text-base">
            ({filteredImages.length} Gambar)
          </span>
        </h1>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-8">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300
                            ${
                              selectedCategory === category
                                ? "bg-sky-500 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            Tidak ada gambar untuk kategori "{selectedCategory}".
          </div>
        ) : (
          <motion.div
            key={selectedCategory}
            // Mengubah kelas grid untuk layout yang lebih dinamis
            className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredImages.map((image) => (
              <motion.div
                key={image.src}
                // Menggunakan fungsi getGridSpan baru berdasarkan aspectRatio gambar
                className={`relative group overflow-hidden rounded-lg shadow-sm ${getGridSpan(
                  image.aspectRatio
                )}`}
                variants={itemVariants}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(image.alt)}
                    className="p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-red-600"
                    title="Hapus Gambar"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs font-medium truncate">
                    {image.categories && image.categories.join(", ")}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
