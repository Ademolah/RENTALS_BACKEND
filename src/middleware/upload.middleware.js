import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // Ensure this points to your existing config

// Configure the Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentals/properties', // The folder in your Cloudinary dashboard
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Premium image formats
    transformation: [{ width: 1920, crop: 'limit' }] // Optimize massive files automatically
  },
});

// Export the configured multer instance
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per image to protect server RAM
});