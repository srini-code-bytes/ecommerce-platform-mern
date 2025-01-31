const mongoose = require('mongoose')

const ProductReviewSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    userName: String,
    rating: Number,
    reviewMessage: String,
}, { timestamps: true }
)

module.exports = mongoose.model('ProductReview', ProductReviewSchema)