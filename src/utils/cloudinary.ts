// src/utils/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file: Express.Multer.File, folder: string): Promise<string> => {
  try {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto'
    });
    
    return result.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary');
  }
};