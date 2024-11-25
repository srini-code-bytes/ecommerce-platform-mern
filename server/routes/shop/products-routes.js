const express = require("express");

//every route will have a separate controller

const {
  getFilteredProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);

module.exports = router;
