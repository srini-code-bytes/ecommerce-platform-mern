const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    // Change file to b64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await imageUploadUtil(url);

    console.log("result", result);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// ADD PRODUCT

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// FETCH ALL PRODUCTS

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    (findProduct.image = image || findProduct.image),
      (findProduct.title = title || findProduct.title),
      (findProduct.description = description || findProduct.description),
      (findProduct.category = category || findProduct.category),
      (findProduct.brand = brand || findProduct.brand),
      (findProduct.price = title || findProduct.price),
      (findProduct.salePrice = title || findProduct.salePrice),
      (findProduct.totalStock = title || findProduct.totalStock);

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
      message: "Edited product successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndUpdate(id);

    if (!deleteProduct) {
      return res.staus(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      return res.staus(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
