import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); //For previewing the image
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {

    setImageLoadingState(true)
    dispatch(addFeatureImage(uploadedImageUrl))
      .then((data) => {
        console.log("handleUploadFeatureImage()", data);
        if (data?.payload?.success) {
          console.log("Image uploaded successfully")
          dispatch(getFeatureImages())
          setImageFile(null)
          setUploadedImageUrl("")
          setImagePreview(null)
        }
        setImageLoadingState(false)
      }
      ).catch((error) => {
        console.log("Error uploading image:", error)
        setImageLoadingState(false)
      })

  }

  function handleDeleteFeatureImage(imageId){
    if(!imageId) return;
    if(window.confirm("Are you sure to delete this image?")){
      dispatch(deleteFeatureImage(imageId))
      .then((data) => {
        if(data?.payload?.success){
          console.log("Image deleted successfully")
          dispatch(getFeatureImages())
        }
      })
      .catch((error) => {
        console.log("Error deleting image :", error)
      })
    }
  }

  function handleResetPreview(){
    setImageFile(null);
    setImagePreview(null);
  }

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch]
  )

  useEffect(() => {
    if(imagePreview){
      URL.revokeObjectURL(imagePreview)
    }
  },[imagePreview])

  console.log("** featureImageList **", featureImageList)
  console.log("AdminDashboard uploadedImageUrl ===>", uploadedImageUrl);

  return <div>
    <ProductImageUpload
      imageFile={imageFile}
      setImageFile={setImageFile}
      uploadedImageUrl={uploadedImageUrl}
      setUploadedImageUrl={setUploadedImageUrl}
      setImageLoadingState={setImageLoadingState}
      imageLoadingState={imageLoadingState}
      // isEditMode={currentEditedId !== null}
      isCustomStyling={true}
      setImagePreview={setImagePreview}
    />

    {imagePreview && (
      <div className="relative mt-5">
        <img src={imagePreview} alt="Preview" className="w-full h-[300px] object-cover rounded-t-lg"/>
        <button onClick={handleResetPreview} className="absolute top-0 right-0 bg-red-500 text-white px-2 py1 
        rounded-full">x</button>
      </div>
    )}

    <Button onClick={handleUploadFeatureImage}
      className="bg-black text-white mt-5 w-full"
      disabled={imageLoadingState || !uploadedImageUrl}
    >
      {imageLoadingState ? "Uploading..." : "Upload"}
    </Button>

    <div className="flex flex-col gap-4 mt-5">
      { featureImageList && featureImageList.length > 0 
      ? featureImageList.map((featureImgItem) => (
        <div className="relative">
          <img
            src={featureImgItem.image}
            alt="Feature Image"
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          <button onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
            className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded"
            > 
            x
          </button>

        </div>
      ))
      : <p>No images available.</p> }
    </div>



  </div>
}

export default AdminDashboard;