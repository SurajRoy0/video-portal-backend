import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // The file has been uploaded successfully
    console.log("File is uploaded on Cloudinary:", response.url);
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    // Remove the locally saved file if it exists, using fs.unlink for asynchronous operation
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.error("Error deleting local file:", err);
        else console.log("Local file deleted successfully.");
      });
    }
    return null;
  }
};

export { uploadOnCloudinary };
