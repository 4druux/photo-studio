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

export default function KelolaGaleri() {
  const { data, error, isLoading } = useSWR("/api/gallery", fetcher);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { mutate } = useSWRConfig();

  const handleDelete = async (filename) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus gambar "${filename}" secara permanen?`
      )
    ) {
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
        Gagal memuat data galeri.
      </div>
    );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <DotLoader text="Memuat gambar..." />
      </div>
    );

  const { images, categories } = data;
  const allCategories = ["All", ...categories];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((image) => image.categories.includes(selectedCategory));

  const getSpanClass = (index) => {
    const patternIndex = index % 11;
    if (patternIndex === 0) return "md:col-span-2 md:row-span-2";
    if (patternIndex === 5 || patternIndex === 9) return "md:row-span-2";
    return "md:col-span-1 md:row-span-1";
  };

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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                className={`relative group overflow-hidden rounded-lg shadow-sm ${getSpanClass(
                  index
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
                    {image.categories.join(", ")}
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
