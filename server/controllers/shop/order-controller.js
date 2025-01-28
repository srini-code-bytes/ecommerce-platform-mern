const Order = require('../../models/Order');

const Cart = require('../../models/Cart');

const paypal = require('../../helpers/paypal');

const Product = require('../../models/Product');

// Controller -> import the controller in routes -> import the routes in server.js -> Create a slice order-slice -> import the slice in store.js

const createOrder = async (req, res) => {
    try {


        const { userId, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartItems, cartId } = req.body;



        // Create a payment JSON

        const create_payment_json = {

            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },

            // The redirect_urls object contains the URLs that the user will be redirected to after the payment is completed.

            redirect_urls: {
                return_url: 'http://localhost:5173/shop/paypal-return',
                cancel_url: 'http://localhost:5173/shop/paypal-cancel'
            },

            // The transactions array contains the list of items that the user is purchasing.

            transactions: [
                {
                    item_list: {
                        items: cartItems.map((item) => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: 'USD',
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: 'USD',
                        total: totalAmount.toFixed(2)
                    },
                    description: 'This is the payment description.'
                }
            ]
        }

        console.log(JSON.stringify(create_payment_json, null, 2));

        // Create a payment instance with the create_payment_json

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error.response.details);

                return res.status(500).json({
                    success: false,
                    message: 'Error while creating paypal payment'
                })
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId
                })

                await newlyCreatedOrder.save();

                // Redirect the user to the approvalURL

                const approvalURL = paymentInfo.links.find((link) => link.rel === 'approval_url').href;

                // Send the approvalURL to the client

                res.status(201).json({
                    success: true,
                    approvalURL,
                    message: 'Order created successfully!',
                    orderId: newlyCreatedOrder._id // Send the orderId to the client
                })
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

const capturePayment = async (req, res) => {
    try {
        const { payerId, paymentId, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order cannot be found'
            })
        }

        order.paymentStatus = 'paid',
            order.orderStatus = 'confirmed',
            order.paymentId = paymentId,
            order.payerId = payerId;

        // Update the total stock based on the quantity of the product in the cart

        for(let item of order.cartItems){
            let product = await Product.findById(item.productId)

            if(!product){
                res.status(404).json({
                    success : false,
                    message: `Not enough stock for this product ${item.title}`
                })
            }

            product.totalStock -= item.quantity;
            await product.save();

        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({
            success: true,
            message: 'order confirmed',
            data: order
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

const getAllOrdersByUser = async (req, res) => {
    try {

        const { userId } = req.params;

        const orders = await Order.find({ userId });

        if (!orders.length) {
            res.status(404).json({
                success: false,
                message: 'No orders found!'
            })

        }

        res.status(200).json({
            success: true,
            data: orders,
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

const getOrderDetails = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!'
            })

        }

        res.status(200).json({
            success: true,
            data: order,
        })



    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

module.exports = { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails }