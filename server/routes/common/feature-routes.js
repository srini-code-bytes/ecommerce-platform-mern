
const express = require("express")

const { addFeatureImage, getFeatureImages, deleteFeatureImage } = require("../../controllers/common/feature-controller")

const router = express.Router();

router.post("/add-feature-image", addFeatureImage)
router.get("/get-feature-images", getFeatureImages)
router.delete("/delete-feature-image/:public_id", deleteFeatureImage)

module.exports = router;