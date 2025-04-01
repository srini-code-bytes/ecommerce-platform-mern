const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    public_id: { type: String, index: true }, // ✅ Used for Cloudinary deletions
    url: { type: String }, // ✅ Optional but useful
});

const ImageCollectionSchema = new mongoose.Schema({
    images : [FeatureSchema],
    createdAt : {type : Date, default : Date.now},
})

module.exports = mongoose.model('ImageCollection', ImageCollectionSchema);