

const express = require("express");

//every route will have a separate controller

const {
addToCart,
fetchCartItems,
updateCartItemQuantity,deleteCartItem
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", updateCartItemQuantity);
router.delete("/:userId/:productId", deleteCartItem);


module.exports = router;
