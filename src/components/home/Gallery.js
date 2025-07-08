import React, { useState } from "react";
import { motion } from "framer-motion";
import Tittle from "../text/Tittle";
import Description from "../text/Description";
import DotLoader from "../loading/DotLoader";
import { containerVariants, itemVariants } from "../../utils/animations";

// Mock data untuk demo - nanti bisa diganti dengan API call
const mockGalleryData = {
  images: [
    {
      src: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      alt: "Portrait 1",
      categories: ["Portrait", "Professional"],
      aspectRatio: 0.75
    },
    {
      src: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      alt: "Couple 1",
      categories: ["Couple", "Wedding"],
      aspectRatio: 1.5
    },
    {
      src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      alt: "Family 1",
      categories: ["Family", "Group"],
      aspectRatio: 1.2
    },
    {
      src: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg",
      alt: "Portrait 2",
      categories: ["Portrait", "Fashion"],
      aspectRatio: 0.8
    },
    {
      src: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
      alt: "Group 1",
      categories: ["Group", "Professional"],
      aspectRatio: 1.3
    },
    {
      src: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg",
      alt: "Wedding 1",
      categories: ["Wedding", "Couple"],
      aspectRatio: 0.9
    }
  ],
  categories: ["Portrait", "Couple", "Family", "Group", "Wedding", "Professional", "Fashion"]
};

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading] = useState(false);

  const data = mockGalleryData;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <DotLoader />
      </div>
    );
  }

  const { images, categories } = data;
  const allCategories = ["All", ...categories];
  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter(
          (img) => img.categories && img.categories.includes(selectedCategory)
        );

  return (
    <section className="pt-12 md:pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <Tittle text="Galeri Momen" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Description
              text="Setiap gambar memiliki cerita. Inilah beberapa di antaranya, disajikan dalam komposisi yang indah."
              className="mt-2 max-w-2xl mx-auto"
            />
          </motion.div>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleCount(10);
                }}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCategory}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-min"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredImages.slice(0, visibleCount).map((image, index) => {
            const aspectRatio = image.aspectRatio || 1;
            const rowSpan = Math.round((1 / aspectRatio) * 20);
            return (
              <motion.div
                key={`${image.src}-${index}`}
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                style={{ gridRowEnd: `span ${rowSpan}` }}
                variants={itemVariants}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
              </motion.div>
            );
          })}
        </motion.div>

        {visibleCount < filteredImages.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-6 py-3 bg-gradient-to-br from-teal-400 via-teal-700 to-teal-600 text-white text-sm font-semibold rounded-full hover:bg-none hover:bg-teal-600"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}

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