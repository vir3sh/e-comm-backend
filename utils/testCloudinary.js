import { v2 as cloudinary } from "cloudinary";

const testCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary connected:", result);
  } catch (error) {
    console.log("Cloudinary connection error:", error);
  }
};

export default testCloudinary;
