import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, uploadImages } from '../services/api';
import { useToast } from '../context/ToastContext';

const ImageUpload = ({ value = '', onChange, multiple = false, maxImages = 10 }) => {
    const [previewUrls, setPreviewUrls] = useState(() => {
        // Initialize with existing URLs if any
        if (value) {
            return multiple 
                ? (Array.isArray(value) ? value : value.split('\n').filter(v => v.trim()))
                : [value].filter(v => v.trim());
        }
        return [];
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { success, error } = useToast();

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;

        // Check if adding these files would exceed maxImages
        if (multiple && previewUrls.length + files.length > maxImages) {
            error(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);

        try {
            if (multiple) {
                // Upload multiple images
                const response = await uploadImages(files);
                if (response.success && response.files) {
                    // Cloudinary returns full URLs, no need to construct
                    const newUrls = response.files.map(file => file.url);
                    
                    const updatedUrls = [...previewUrls, ...newUrls];
                    setPreviewUrls(updatedUrls);
                    onChange(updatedUrls.join('\n'));
                    success(`Successfully uploaded ${newUrls.length} image(s)`);
                }
            } else {
                // Upload single image
                const response = await uploadImage(files[0]);
                if (response.success && response.url) {
                    // Cloudinary returns full URL, no need to construct
                    setPreviewUrls([response.url]);
                    onChange(response.url);
                    success('Image uploaded successfully');
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
            error(err.response?.data?.message || 'Failed to upload image(s)');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index) => {
        const updatedUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(updatedUrls);
        onChange(multiple ? updatedUrls.join('\n') : (updatedUrls[0] || ''));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        if (files.length > 0) {
            const fakeEvent = { target: { files } };
            handleFileSelect(fakeEvent);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    uploading
                        ? 'border-coffee-400 bg-coffee-50'
                        : 'border-coffee-300 hover:border-forest-800 hover:bg-forest-800/5'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`image-upload-${multiple ? 'multiple' : 'single'}`}
                    disabled={uploading}
                />
                
                <label
                    htmlFor={`image-upload-${multiple ? 'multiple' : 'single'}`}
                    className="cursor-pointer flex flex-col items-center gap-3"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin text-forest-800" size={32} />
                            <p className="text-sm font-semibold text-coffee-900">
                                Uploading...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-forest-800/10 rounded-full">
                                <Upload size={32} className="text-forest-800" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-coffee-900 mb-1">
                                    {multiple ? 'Click to upload images' : 'Click to upload image'}
                                </p>
                                <p className="text-xs text-coffee-600/70">
                                    {multiple 
                                        ? `Drag and drop up to ${maxImages} images, or click to browse`
                                        : 'Drag and drop an image, or click to browse'
                                    }
                                </p>
                                <p className="text-xs text-coffee-600/50 mt-1">
                                    Supported: JPEG, PNG, GIF, WebP (Max 5MB each)
                                </p>
                            </div>
                        </>
                    )}
                </label>
            </div>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {previewUrls.map((url, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-coffee-200">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    aria-label="Remove image"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs">
                                    {index + 1}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Info Text */}
            {previewUrls.length > 0 && (
                <p className="text-xs text-coffee-600/60">
                    {multiple 
                        ? `${previewUrls.length} image(s) uploaded. You can add more or remove any.`
                        : 'Image uploaded. Click to replace or remove.'
                    }
                </p>
            )}
        </div>
    );
};

export default ImageUpload;

