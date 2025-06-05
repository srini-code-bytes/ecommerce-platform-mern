const Product = require("../../models/Product");

// Implement filter functionality on the shopping page
const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length && category !== "products") {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    console.log("Sort By:", sortBy);

    switch (sortBy) {
      case "price-lowtohigh":
        console.log("Inside price-lowtohigh");
        sort.price = 1;
        break;

      case "price-hightolow":
        console.log("Inside price-hightolow");
        sort.price = -1;
        break;

      case "title-atoz":
        console.log("Inside title-atoz");
        sort.title = 1;
        break;

      case "title-ztoa":
        console.log("Inside title-ztoa");
        sort.title = -1;
        break;

      default:
        sort.price = 1;
    }

    console.log("Filters:", filters);
    console.log("Sort:", sort);

    const products = await Product.find(filters).sort(sort);
    // console.log(products);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// Controller -> routes -> store -> make changes for onClick on the respective UI page for onClick logic
const getProductDetails = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
