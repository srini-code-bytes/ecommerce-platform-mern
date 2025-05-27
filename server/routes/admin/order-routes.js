const express = require("express");

const {
  getAllOrdersByAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/get", authMiddleware, getAllOrdersByAllUsers);

router.get("/details/:id", authMiddleware, getOrderDetailsForAdmin);

router.put("/update-order/:id", authMiddleware, updateOrderStatus);

module.exports = router;
