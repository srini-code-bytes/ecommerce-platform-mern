const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");

require("dotenv").config();

// Configure cloudinary - signed up using gmail
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer-storage-cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional transformations
  }
})

const upload = multer({storage:cloudinaryStorage, limits : {fileSize : 500 * 1024}}).array('my_files', 10); // store the image url in the cloudinary

module.exports = {upload};