const Order = require('../../models/Order')
const Product = require('../../models/Product')
const ProductReview = require('../../models/Review')
const mongoose = require("mongoose");

// const addProductReview = async (req, res) => {
//     try {
//         // Get fields from Review.js model
//         const { productId,
//             userId,
//             userName,
//             rating,
//             reviewMessage } = req.body;

//         // Find order 
//         const order = await Order.findOne({
//             userId,
//             "cartItems.productId": productId,
//             orderStatus: "confirmed"
//         })

//         // Check if order exists
//         if (!order) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Order not found",
//             })
//         }

//         // Check if a review already exists
//         const checkExistingReview = await ProductReview.findOne({
//             userId,
//             productId,
//         })


//         if (checkExistingReview) {
//             return res.status(400).json({
//                 success: false,
//                 message: "You have already reviewed this product"
//             })
//         }

//         const newReview = await ProductReview.create({
//             productId,
//             userId,
//             userName,
//             rating,
//             reviewMessage
//         })

//         await newReview.save()

//         const reviews = await ProductReview.find({
//             productId: productId
//         })

//         const totalReviewsLength = reviews.length;

//         const averageRating = reviews.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) / totalReviewsLength;

//         await Product.findByIdAndUpdate(productId, { averageRating });

//         res.status(201).json({
//         success: true,
//         data: newReview,
//         });

//     } catch (e) {
//         console.log(e);
//         res.status(500).json({
//             success: false,
//             message: 'Error'
//         })
//     }
// }

const addProductReview = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Start a transaction

    try {
        const { productId, userId, userName, rating, reviewMessage } = req.body;

        // Find order
        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            orderStatus: "confirmed"
        }).session(session); // Use session

        if (!order) {
            await session.abortTransaction(); // Rollback
            session.endSession();
            return res.status(403).json({
                success: false,
                message: "Order not found",
            });
        }

        // Check if a review already exists
        const checkExistingReview = await ProductReview.findOne({
            userId,
            productId,
        }).session(session);

        if (checkExistingReview) {
            await session.abortTransaction(); // Rollback
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // Create and save review
        const newReview = await ProductReview.create([{
            productId,
            userId,
            userName,
            rating,
            reviewMessage
        }], { session });

        // Get all reviews for the product
        const reviews = await ProductReview.find({ productId }).session(session);
        const totalReviewsLength = reviews.length;
        const averageRating = reviews.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) / totalReviewsLength;

        // Update product's average rating
        await Product.findByIdAndUpdate(productId, { averageRating }, { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            data: newReview,
        });

    } catch (e) {
        console.log(e);
        await session.abortTransaction(); // Rollback on error
        session.endSession();
        res.status(500).json({
            success: false,
            message: 'Error'
        });
    }
};

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