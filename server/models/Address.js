const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({

    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
}, {timestamps: true});

// creates the model, which you can use to interact with the addresses collection in your MongoDB database.

module.exports = mongoose.model('Address', AddressSchema)