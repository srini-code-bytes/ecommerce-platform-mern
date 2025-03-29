const cloudinary = require("cloudinary").v2;
const multer = require("multer");

require("dotenv").config();

// Configure cloudinary - signed up using gmail
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Created storage using Multer
const storage = new multer.memoryStorage();

// Cloudinary Upload: cloudinary.uploader.upload uploads the file to Cloudinary. 
// The option resource_type: 'auto' lets Cloudinary handle various file types (e.g., image, video, raw files).

async function imageUploadUtil(file) {

    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    })

    console.log("result", result);

    return result;
}

const upload = multer({storage}); // store the image url in the cloudinary

module.exports = {upload, imageUploadUtil};