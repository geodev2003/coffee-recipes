import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Get all images (support both old format with single image and new format with images array)
    const allImages = images && images.length > 0 
        ? images 
        : [];

    if (allImages.length === 0) {
        return null;
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextLightbox = () => {
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevLightbox = () => {
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <>
            <div className="relative">
                {/* Main Image */}
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-card group">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            src={allImages[currentIndex]}
                            alt={`Recipe image ${currentIndex + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => openLightbox(currentIndex)}
                        />
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={24} className="text-coffee-900" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                <ChevronRight size={24} className="text-coffee-900" />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                <span className="text-sm font-semibold text-coffee-900">
                                    {currentIndex + 1} / {allImages.length}
                                </span>
                            </div>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            {allImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentIndex
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {allImages.map((image, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                    index === currentIndex
                                        ? 'border-forest-800 shadow-lg'
                                        : 'border-transparent hover:border-coffee-900/30'
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close lightbox"
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-6xl w-full max-h-[90vh]"
                        >
                            <img
                                src={allImages[lightboxIndex]}
                                alt={`Recipe image ${lightboxIndex + 1}`}
                                className="w-full h-full object-contain rounded-lg"
                            />

                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevLightbox}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={32} className="text-white" />
                                    </button>
                                    <button
                                        onClick={nextLightbox}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={32} className="text-white" />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
                                        <span className="text-white font-semibold">
                                            {lightboxIndex + 1} / {allImages.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ImageGallery;

