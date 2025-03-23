import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create and export the upload function
export const uploadToCloudinary = async (filePath) => {
	try {
		const result = await cloudinary.uploader.upload(filePath);
		return result;
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		throw error;
	}
};

export default cloudinary;
