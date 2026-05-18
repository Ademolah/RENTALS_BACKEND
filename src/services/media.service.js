import cloudinary from '../config/cloudinary.js';

export const generateUploadSignature = (folderName = 'rentals/general') => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Define the upload parameters to sign
  const uploadParams = {
    timestamp,
    folder: folderName,
  };

  // Cryptographically sign the request so Cloudinary knows it's authorized by us
  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: folderName,
  };
};