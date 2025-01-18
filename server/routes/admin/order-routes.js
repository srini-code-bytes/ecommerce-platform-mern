const express = require("express");

const { getAllOrdersByAllUsers, getOrderDetailsForAdmin } = require('../../controllers/admin/order-controller')

const router = express.Router();

router.get('/get', getAllOrdersByAllUsers)

router.get('/details/:id', getOrderDetailsForAdmin)

module.exports = router;