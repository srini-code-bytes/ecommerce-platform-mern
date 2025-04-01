
const ImageCollection = require("../../models/Feature"); // model

const addFeatureImage = async (req, res) => {
    try {
        console.log("req.user", req.user)
        const uploadedBy = "Srini";
        console.log("uploadedBy", uploadedBy)
        const { images } = req.body;

        const newImageCollection = new ImageCollection({
            images,
            updatedBy: uploadedBy
        })
        await newImageCollection.save();
        res.status(201).json({
            success: true,
            data: newImageCollection
        })
    } catch (e) {
        console.log("addFeatureImage() e:", e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}

const getFeatureImages = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const imageLimitPerPage = parseInt(req.query.limit) || 3;
        const startIndex = (currentPage - 1) * imageLimitPerPage;
        const endIndex = currentPage * imageLimitPerPage;

        const imageCollection = await ImageCollection.find();

        const allImages = imageCollection.reduce((acc, collection) => acc.concat(collection.images), [])

        const totalImages = allImages.length;
        const totalPages = Math.ceil(totalImages / imageLimitPerPage);

        const currentImages = allImages.slice(startIndex, endIndex)
        
        res.status(200).json({
            success: true,
            data: currentImages,
            page: currentPage, 
            limit: imageLimitPerPage,
            totalImages,
            totalPages 
        })
    } catch (e) {
        console.log("getFeatureImages() e : ", e)
        res.status(500).json({
            success: false,
            message: "Error fetching images"
        })
    }
}

const deleteFeatureImage = async (req, res) => {
    try {
        const { public_id } = req.params;
        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: "Image public_id is required"
            })
        }
        const imageCollection = await ImageCollection.findOne({ "images.public_id": public_id });
        console.log("imageCollection ====>", imageCollection)
        if (!imageCollection) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }
        
        imageCollection.images = imageCollection.images.filter((image) => image.public_id !== public_id);
        if (imageCollection.images.length === 0) {
            await ImageCollection.findByIdAndDelete(imageCollection._id);
        } else {
            await imageCollection.save()
        }
        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })
    } catch (error) {
        console.log("Error deleting image : ", error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage }

