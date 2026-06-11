

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; 

// Configure the Cloudinary storage engine dynamically
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if the current file stream is a video
    const isVideo = file.mimetype.startsWith('video/');

    return {
      folder: 'rentals/properties',
      // 1. Tell Cloudinary to automatically handle the asset type routing
      resource_type: isVideo ? 'video' : 'image',
      
      // 2. Allow appropriate premium extensions based on format type
      allowed_formats: isVideo 
        ? ['mp4', 'webm', 'mov', 'quicktime'] 
        : ['jpg', 'jpeg', 'png', 'webp'],
      
      // 3. Only apply image compression limits if it's NOT a video
      transformation: isVideo 
        ? [] 
        : [{ width: 1920, crop: 'limit' }]
    };
  },
});

// Export the configured multer instance
export const upload = multer({ 
  storage: storage,
  // 4. Bumped from 5MB to 35MB to allow brief high-end cinematic video files
  limits: { fileSize: 35 * 1024 * 1024 } 
});