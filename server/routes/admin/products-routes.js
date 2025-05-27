const express = require("express");

const {
  // handleImageUpload,
  // handleMultipleImageUpload,
  uploadImage,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");
const multer = require("multer");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

// const { upload } = require("../../helpers/cloudinary");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// POST request is made to /products/upload-image with a file under the my_file field

// The upload middleware processes the file, uploads it to Cloudinary, and attaches the result to the request object.

// router.post(
//   "/upload-image",
//   upload.single("my_file"),
//   handleImageUpload
// );

router.post(
  "/upload-images", authMiddleware,
  // upload.array("my_files", 10),
  uploadImage
);

router.post("/add", authMiddleware, addProduct);
router.put("/edit/:id", authMiddleware, editProduct);
router.delete("/delete/:id", authMiddleware, deleteProduct);
router.get("/get", authMiddleware, fetchAllProducts);

module.exports = router;
