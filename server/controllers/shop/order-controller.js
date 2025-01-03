// const { payment } = require("paypal-rest-sdk");

const Order = require('../../models/Order');

const paypal = require('../../helpers/paypal');


const createOrder = async (req, res) => {
    try {


        const { userId, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId } = req.body;

        // Create a payment JSON

        const create_payment_json = {

            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            
            // The redirect_urls object contains the URLs that the user will be redirected to after the payment is completed.

            redirect_urls: {
                return_url: 'http://localhost:5173/shop/paypal-return',
                cancel_url: 'http://localhost:8080/shop/paypal-cancel'
            },

            // The transactions array contains the list of items that the user is purchasing.

            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
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

        // Create a payment instance with the create_payment_json

        paypal.payment.create(create_payment_json, async function (error, paymentInfo) {
            if (error) {
                console.log(error);

                return res.status(500).json({
                    success: false,
                    message: 'Error while creating paypal payment'
                })
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
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

                const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href;

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

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

module.exports = { createOrder, capturePayment }