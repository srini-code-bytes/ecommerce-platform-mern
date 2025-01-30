

const express = require("express");

// every route will have a separate controller

const {
    searchProducts
} = require("../../controllers/shop/search-controller");

const router = express.Router();

// router.get("/:keyword", searchProducts);
router.get("/", searchProducts);

module.exports = router;
