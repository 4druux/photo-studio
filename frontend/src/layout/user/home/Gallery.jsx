"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import Tittle from "@/components/text/Tittle";
import Description from "@/components/text/Description";
import DotLoader from "@/components/loading/dotloader";
import GalleryModal from "@/components/GalleryModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { containerVariants, itemVariants } from "@/utils/animations";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Gallery() {
  const { data, error } = useSWR("/api/gallery", fetcher);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);

  const scrollContainerRef = useRef(null);
  const btnRefs = useRef([]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(pointer: coarse)");
      setIsTouchDevice(mq.matches);
      const handler = (e) => setIsTouchDevice(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const checkScroll = () => {
    const c = scrollContainerRef.current;
    if (c) {
      const { scrollLeft, scrollWidth, clientWidth } = c;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const c = scrollContainerRef.current;
    if (c) {
      checkScroll();
      c.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        if (c) {
          c.removeEventListener("scroll", checkScroll);
        }
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [data]);

  const handleScroll = (offset) => {
    const c = scrollContainerRef.current;
    if (c) {
      c.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (category, idx) => {
    setSelectedCategory(category);
    setVisibleCount(10);
    const c = scrollContainerRef.current;
    const b = btnRefs.current[idx];
    if (c && b) {
      const scrollTo = b.offsetLeft - c.clientWidth / 2 + b.offsetWidth / 2;
      c.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
      : images.filter(
          (img) => img.categories && img.categories.includes(selectedCategory)
        );

  const dragProps = isTouchDevice
    ? {
        drag: "x",
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 0.2,
        onDrag: (_, info) => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= info.delta.x;
          }
        },
      }
    : {};

  return (
    <section className="pt-12 md:pt-24">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
        }
      `}</style>
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

        <div className="relative w-full max-w-4xl mx-auto mb-8">
          {canScrollLeft && (
            <motion.button
              onClick={() => handleScroll(-250)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 hidden md:flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          <motion.div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-1 no-scrollbar"
            {...dragProps}
          >
            {allCategories.map((category, idx) => (
              <button
                key={category}
                ref={(el) => (btnRefs.current[idx] = el)}
                onClick={() => handleCategoryClick(category, idx)}
                className={`px-5 py-2 text-sm font-semibold rounded-full shrink-0 transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {canScrollRight && (
            <motion.button
              onClick={() => handleScroll(250)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 hidden md:flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}
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
                onClick={() => openModal(index)}
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
            );
          })}
        </motion.div>

        {visibleCount < filteredImages.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-6 py-3 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-500 text-white text-sm font-semibold rounded-full hover:bg-none hover:bg-sky-500"
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

      <AnimatePresence>
        {modalOpen && (
          <GalleryModal
            images={filteredImages}
            startIndex={selectedImageIndex}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
