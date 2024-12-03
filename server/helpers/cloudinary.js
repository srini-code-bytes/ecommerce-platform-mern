const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure cloudinary - signed up using gmail
cloudinary.config({
  cloud_name: "dcdbs6pc6",
  api_key: "696979944986391",
  api_secret: "BKcNfh760m3fS48AKmpB4YRgH6E",
});

// Created storage using Multer
const storage = new multer.memoryStorage();

// Cloudinary Upload: cloudinary.uploader.upload uploads the file to Cloudinary. The option resource_type: 'auto' lets Cloudinary handle various file types (e.g., image, video, raw files).

async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    })

    console.log("result", result);

    return result;
}

const upload = multer({storage}); // store the image url in the cloudinary

module.exports = {upload, imageUploadUtil};