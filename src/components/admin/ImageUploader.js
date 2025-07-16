import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Type } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ImageUploader = ({ onImagesUploaded }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setIsUploading(true);
    
    const newImages = acceptedFiles.map(file => {
      const id = Date.now() + Math.random();
      return {
        id,
        file,
        url: URL.createObjectURL(file),
        caption: '',
        alt: file.name.split('.')[0],
        category: 'General'
      };
    });

    setTimeout(() => {
      setUploadedImages(prev => [...prev, ...newImages]);
      setIsUploading(false);
      toast.success(`${newImages.length} image(s) uploaded successfully!`);
      if (onImagesUploaded) {
        onImagesUploaded(newImages);
      }
    }, 1000);
  }, [onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const updateImageCaption = (id, caption) => {
    setUploadedImages(prev => 
      prev.map(img => img.id === id ? { ...img, caption } : img)
    );
  };

  const updateImageCategory = (id, category) => {
    setUploadedImages(prev => 
      prev.map(img => img.id === id ? { ...img, category } : img)
    );
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    toast.success('Image removed');
  };

  const categories = ['General', 'Portrait', 'Wedding', 'Family', 'Corporate', 'Events'];

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-teal-100 rounded-full">
            <Upload className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              {isDragActive ? 'Drop images here' : 'Upload Images'}
            </h3>
            <p className="text-gray-500 mt-1">
              Drag & drop images or click to browse
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Supports: JPEG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center space-x-2 text-teal-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent"></div>
              <span>Uploading images...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Uploaded Images ({uploadedImages.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Type className="w-4 h-4 inline mr-1" />
                      Caption
                    </label>
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => updateImageCaption(image.id, e.target.value)}
                      placeholder="Add a caption..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={image.category}
                      onChange={(e) => updateImageCategory(image.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;