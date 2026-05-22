

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// 1. Force environment variables to load right now
dotenv.config();

// 2. Now process.env will actually contain your keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;