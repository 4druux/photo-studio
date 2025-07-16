import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";

// Mock gallery data with captions
const mockGalleryData = {
  images: [
    {
      id: 1,
      src: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      alt: "Professional Portrait",
      caption: "Elegant professional headshot with natural lighting",
      categories: ["Portrait", "Professional"],
      aspectRatio: 0.75
    },
    {
      id: 2,
      src: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      alt: "Wedding Couple",
      caption: "Beautiful wedding moment captured in golden hour",
      categories: ["Wedding", "Couple"],
      aspectRatio: 1.5
    },
    {
      id: 3,
      src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      alt: "Family Portrait",
      caption: "Joyful family gathering with three generations",
      categories: ["Family", "Group"],
      aspectRatio: 1.2
    },
    {
      id: 4,
      src: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg",
      alt: "Fashion Portrait",
      caption: "Contemporary fashion photography with dramatic shadows",
      categories: ["Portrait", "Fashion"],
      aspectRatio: 0.8
    },
    {
      id: 5,
      src: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
      alt: "Corporate Group",
      caption: "Professional team photo for corporate branding",
      categories: ["Group", "Corporate"],
      aspectRatio: 1.3
    },
    {
      id: 6,
      src: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg",
      alt: "Wedding Ceremony",
      caption: "Intimate wedding ceremony in a beautiful garden setting",
      categories: ["Wedding", "Events"],
      aspectRatio: 0.9
    },
    {
      id: 7,
      src: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg",
      alt: "Maternity Portrait",
      caption: "Tender maternity session celebrating new life",
      categories: ["Portrait", "Maternity"],
      aspectRatio: 0.7
    },
    {
      id: 8,
      src: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
      alt: "Children Portrait",
      caption: "Playful children's portrait with natural expressions",
      categories: ["Portrait", "Children"],
      aspectRatio: 1.1
    }
  ],
  categories: ["Portrait", "Wedding", "Family", "Group", "Corporate", "Fashion", "Events", "Maternity", "Children"]
};

const GalleryModal = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
        onClick={handlePrev}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
        onClick={handleNext}
      >
        <ChevronRight size={32} />
      </button>

      <div
        className="relative max-w-4xl max-h-[80vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        
        {/* Caption and Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
          <h3 className="text-white text-xl font-semibold mb-2">
            {currentImage.alt}
          </h3>
          {currentImage.caption && (
            <p className="text-gray-200 mb-3">{currentImage.caption}</p>
          )}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300 text-sm">
                {currentImage.categories.join(", ")}
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const data = mockGalleryData;
  const { images, categories } = data;
  const allCategories = ["All", ...categories];
  
  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter(img => img.categories.includes(selectedCategory));

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of professional photography showcasing 
              moments of joy, love, and celebration.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
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

        {/* Gallery Grid */}
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openModal(index)}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-lg mb-1">{image.alt}</h3>
                  {image.caption && (
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {image.caption}
                    </p>
                  )}
                  <div className="flex items-center mt-2 space-x-2">
                    <Camera className="w-4 h-4" />
                    <span className="text-xs">
                      {image.categories.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No images found for "{selectedCategory}"</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-white rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Own Memories?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let us capture your special moments with the same care and 
            professionalism you see in our gallery.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
          >
            View Our Services
          </Link>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <GalleryModal
            images={filteredImages}
            startIndex={selectedImageIndex}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}