const express = require("express");

const { getAllOrdersByAllUsers, getOrderDetailsForAdmin, updateOrderStatus } = require('../../controllers/admin/order-controller')

const router = express.Router();

router.get('/get', getAllOrdersByAllUsers)

router.get('/details/:id', getOrderDetailsForAdmin)

router.put('/update-order/:id', updateOrderStatus)

module.exports = router;