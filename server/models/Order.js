

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: String,
    cartId : String,
    cartItems: [
        {
            productId: String,
            title: String,
            price: Number,
            salePrice: String,
            image: String,
            quantity : Number

        }
    ],
    addressInfo: {
        addressId: String,
        address: String,
        city: String,
        phone: String,
        pincode : String,
        notes: String
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String,
    payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema)   
// creates the model, which you can use to interact with the orders collection in your MongoDB database.