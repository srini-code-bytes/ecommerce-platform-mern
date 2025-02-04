const Order = require('../../models/Order')
const Product = require('../../models/Product')
const ProductReview = require('../../models/Review')

await Product.findByIdAndUpdate(
    {
        _id: productId,
        averageReview: averageReview
    }
)


const addProductReview = async (req, res) => {
    try {
        // Get fields from Review.js model
        const { productId,
            userId,
            userName,
            rating,
            reviewMessage } = req.body;

        // Find order 
        const order = await Order.findOne({
            userId: userId,
            "cartItems.productId": productId,
            orderStatus: "delivered"
        })

        // Check if order exists
        if (!order) {
            return res.status(403).json({
                success: false,
                message: "Order not found"
            })
        }

        // Check if a review already exists
        const checkExistingReview = await ProductReview.findOne({
            userId: userId,
            productId: productId
        })


        if (checkExistingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            })
        }

        const newReview = await ProductReview.create({
            productId,
            userId,
            userName,
            rating,
            reviewMessage
        })

        await newReview.save()

        const reviews = await ProductReview.find({
            productId: productId
        })

        const totalReviewsLength = reviews.length;
        const averageRating = reviews.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) / totalReviewsLength;




    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await ProductReview.find({
            productId : productId
        })

        if(!reviews) {
            return res.status(404).json({
                success: false,
                message : "No reviews found"
            })
        }

        res.status(200).json({
            success : true,
            message : "Reviews found",
            data: reviews
        })




    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

module.exports = { addProductReview, getProductReviews }