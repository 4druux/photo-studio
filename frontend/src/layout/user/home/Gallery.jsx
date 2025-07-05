"use client";

import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { motion } from "framer-motion";
import Tittle from "@/components/text/Tittle";
import Description from "@/components/text/Description";
import DotLoader from "@/components/loading/dotloader";

const fetcher = (url) => fetch(url).then((res) => res.json());

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

export default function Gallery() {
  const { data, error } = useSWR("/api/gallery", fetcher);
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (error)
    return <div className="text-center py-12">Gagal memuat galeri.</div>;
  if (!data)
    return (
      <div className="flex justify-center py-20">
        <DotLoader text="Memuat galeri..." />
      </div>
    );

  const { images, categories } = data;
  const allCategories = ["All", ...categories];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((image) => image.categories.includes(selectedCategory));

  // Logika baru untuk layout yang lebih stabil dan menarik
  const getSpanClass = (index) => {
    // Pola ini akan membuat gambar pertama lebar, dan beberapa gambar lainnya tinggi.
    const patternIndex = index % 11;
    if (patternIndex === 0) return "md:col-span-2 md:row-span-2"; // Gambar besar
    if (patternIndex === 5 || patternIndex === 9) return "md:row-span-2"; // Gambar tinggi
    return "md:col-span-1 md:row-span-1"; // Gambar standar
  };

  return (
    <section className="pt-12 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <Tittle text="Galeri Momen" />
          <Description
            text="Setiap gambar memiliki cerita. Inilah beberapa di antaranya, disajikan dalam komposisi yang indah."
            className="mt-2 max-w-2xl mx-auto"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300
                ${
                  selectedCategory === category
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* **PERBAIKAN UTAMA PADA GRID** */}
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              className={`relative overflow-hidden rounded-xl shadow-lg group cursor-pointer ${getSpanClass(
                index
              )}`}
              variants={itemVariants}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority={index < 8}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            Tidak ada gambar untuk kategori "{selectedCategory}".
          </motion.div>
        )}
      </div>
    </section>
  );
}
