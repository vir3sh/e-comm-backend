import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "ecommerce/products",
    });

    fs.unlinkSync(file.path); // remove local temp file after successful upload
    console.log("Cloudinary Upload Success:", result.secure_url);
    return result;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw error;
  }
};
