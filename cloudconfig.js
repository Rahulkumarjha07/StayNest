const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlast_DEV",
    allowedFormats: ["jpeg", "png", "jpg"],
    transformation: [
      { width: 1000, height: 800, crop: "limit", quality: "auto" }
    ]
  }
});

module.exports = {
  cloudinary,
  storage,
};