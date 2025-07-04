"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import Tittle from "@/components/text/Tittle";
import Description from "@/components/text/Description";

// --- DATA GAMBAR DENGAN LAYOUT BERBASIS RASIO ASPEK ---
// Kita definisikan layout berdasarkan kelas Tailwind untuk 'span'
const allImages = [
  { src: "/images/1.jpg", alt: "Foto lanskap", layout: "md:col-span-2" }, // Lanskap (16:9, 5:4)
  { src: "/images/2.png", alt: "Foto potret", layout: "row-span-2" }, // Potret (4:5, 9:16)
  { src: "/images/1.jpg", alt: "Foto persegi" }, // Persegi (1:1)
  { src: "/images/1.jpg", alt: "Foto persegi" }, // Persegi (1:1)
  { src: "/images/1.jpg", alt: "Foto persegi" }, // Persegi (1:1)
  { src: "/images/1.jpg", alt: "Foto lanskap", layout: "md:col-span-2" }, // Lanskap
  { src: "/images/1.jpg", alt: "Foto lanskap", layout: "md:col-span-2" }, // Lanskap
  { src: "/images/2.png", alt: "Foto potret", layout: "row-span-2" }, // Potret
  { src: "/images/1.jpg", alt: "Foto persegi" }, // Persegi
  // --- Gambar untuk "Load More" ---
  { src: "/images/1.jpg", alt: "Foto persegi" }, // Persegi
  { src: "/images/1.jpg", alt: "Foto lanskap", layout: "md:col-span-2" }, // Lanskap
  { src: "/images/2.png", alt: "Foto potret", layout: "row-span-2" }, // Potret
  { src: "/images/1.jpg", alt: "Foto persegi" }, // Persegi
];

// Varian animasi untuk Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Gallery() {
  const [visibleCount, setVisibleCount] = useState(8);

  const loadMoreImages = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const visibleImages = allImages.slice(0, visibleCount);

  return (
    <section id="gallery" className="pt-12 md:pt-24">
      <div className="container mx-auto px-4">
        {/* Judul Section */}

        <div className="text-center mb-4 lg:mb-8">
          <Tittle text="Galeri Momen" />

          <Description
            text="Setiap gambar memiliki cerita. Inilah beberapa di antaranya,
            disajikan dalam komposisi yang indah."
            className="mt-2 max-w-2xl mx-auto"
          />
        </div>

        <motion.div
          key={visibleCount}
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[240px] gap-4 grid-flow-dense"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {visibleImages.map((image, index) => (
            <motion.div
              key={`${index}-${image.src}`}
              className={`relative overflow-hidden rounded-xl shadow-lg group ${
                image.layout || ""
              }`}
              variants={itemVariants}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority={index < 8}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {visibleCount < allImages.length && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={loadMoreImages}
                className=" text-white bg-gradient-to-br from-sky-200 via-sky-500 to-blue-500 hover:bg-none hover:bg-sky-600 
                font-semibold flex items-center justify-center mx-auto  shadow-sm hover:shadow-md py-3 px-8 rounded-full"
              >
                Lihat Lebih Banyak
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
