import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export const saveCoverCloudinary = new CloudinaryStorage({
  cloudinary,
  params: {
    format: "png",
    folder: "striveBlog/covers",
  },
});
