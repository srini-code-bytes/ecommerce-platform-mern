const express = require('express');

const { addAddress, editAddress, fetchAllAddress, deleteAddress } = require('../../controllers/shop/address-controller');

const router = express.Router();

router.post('/add-address', addAddress); 

router.get('/get-address/:userId', fetchAllAddress);

router.delete('/delete-address/:userId/:addressId', deleteAddress);

router.put('/edit-address/:userId/:addressId', editAddress);

module.exports = router;
