const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// const handleImageUpload = async (req, res) => {
//   try {
//     // Change file to b64
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     const url = "data:" + req.file.mimetype + ";base64," + b64;

//     const result = await imageUploadUtil(url);

//     console.log("result", result);

//     res.json({
//       success: true,
//       result,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       message: "Error occured",
//     });
//   }
// };

// ADD PRODUCT

const handleMultipleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded"
      })
    }
    // convert each file to base64 and then upload it to cloudinary    
    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = "data:" + file.mimetype + ";base64," + b64;
      return await imageUploadUtil(url);
    })

    const results = await Promise.all(uploadPromises);
    console.log("** Uploaded images **", results)

    if (!results || results.length === 0) {
      return res.status(500).json({
        success: false,
        message: "All images failed to upload"
      })
    }

    return res.status(201).json({
      success: true,
      images: results,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Error occured"
    })
  }
}

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
      (findProduct.price = price === '' ? 0 : price || findProduct.price),
      (findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice),
      (findProduct.totalStock = totalStock || findProduct.totalStock);

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
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      return res.status(200).json({
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
  // handleImageUpload,
  handleMultipleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
