

const Order = require('../../models/Order')



const getAllOrdersByAllUsers = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const orderLimitPerPage = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * orderLimitPerPage;
        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / orderLimitPerPage);
        const orders = await Order.find({}).skip(skip).limit(orderLimitPerPage);
        console.log("orders", orders);

        // .sort({
        //     orderDate: -1
        // })

        if (!orders.length) {
            res.status(404).json({
                success: false,
                message: 'No orders found!'
            })

        }

        res.status(200).json({
            success: true,
            data: orders,
            page: currentPage,
            limit: orderLimitPerPage,
            totalOrders, 
            totalPages
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })

    }
}

const getOrderDetailsForAdmin = async (req, res) => {
    try {

        const { id } = req.params;

        console.log("id", id)

        const order = await Order.findById(id);

        console.log("order", order)

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

// API for Update Order Status in Order Details page

const updateOrderStatus = async (req, res) => {

    try {
        const { id } = req.params;
        console.log("updateOrderStatus id====>", id)
        const { orderStatus } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!'
            })

        }

        await Order.findByIdAndUpdate(id, { orderStatus })
        res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
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

module.exports = { getAllOrdersByAllUsers, getOrderDetailsForAdmin, updateOrderStatus };