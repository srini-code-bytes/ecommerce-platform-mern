
const Feature = require("../../models/Feature"); // model

const addFeatureImage = async (req, res) => {
    try {
        const { image } = req.body;
        const featureImages = new Feature({
            image
        })

        await featureImages.save();
        res.status(201).json({
            success: true,
            data: featureImages
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
        const images = await Feature.find({})

        res.status(200).json({
            success: true,
            data: images
        })

    } catch (e) {
        console.log("getFeatureImages() e : ", e)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}

const deleteFeatureImage = async (req, res) => {

    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Image ID is required"
            })
        }
        const deletedImage = await Feature.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }
        console.log("Image deleted successfully:", deletedImage); 
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

