import DeleteConfirmationModal from "@/components/admin-view/delete-confirm-modal";
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
  const [deleteImageId, setDeleteImageId] = useState(null)

  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const showImagesPerPage = 3;
  const totalImages = featureImageList.length;
  const totalPages = Math.ceil(totalImages / showImagesPerPage);
  const startIndex = (currentPage - 1) * showImagesPerPage;
  const currentImages = featureImageList.slice(startIndex, startIndex + showImagesPerPage);
  console.log("currentImages ====>", currentImages)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

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

  function handleDeleteFeatureImage() {
    console.log("** Delete image id:", deleteImageId)
    if (!deleteImageId) return;
    // if(window.confirm("Are you sure to delete this image?")){

    dispatch(deleteFeatureImage(deleteImageId))
      .then((data) => {
        if (data?.payload?.success) {
          console.log("Image deleted successfully")
          dispatch(getFeatureImages())

          if(currentPage > 1 && currentImages.length === 1){
            setCurrentPage(currentPage -1)
          }
        }
      })
      .catch((error) => {
        console.log("Error deleting image :", error)
      })

    setDeleteImageId(null);

  }

  function handleResetPreview() {
    setImageFile(null);
    setImagePreview(null);
  }

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch]
  )

  useEffect(() => {
    // else the image disappears prior to display
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [imagePreview])

  return <div>
    <ProductImageUpload
      imageFile={imageFile}
      setImageFile={setImageFile}
      uploadedImageUrl={uploadedImageUrl}
      setUploadedImageUrl={setUploadedImageUrl}
      setImageLoadingState={setImageLoadingState}
      imageLoadingState={imageLoadingState}
      isCustomStyling={true}
      setImagePreview={setImagePreview}
    />

    {imagePreview && (
      <div className="relative mt-5">
        <img src={imagePreview} alt="Preview" className="w-full h-[300px] object-cover rounded-t-lg" />
        <button onClick={handleResetPreview} className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 
        rounded-full">x</button>
      </div>
    )}

    <Button onClick={handleUploadFeatureImage}
      className="bg-black text-white mt-5 w-full"
      disabled={imageLoadingState || !uploadedImageUrl}
    >
      {imageLoadingState ? "Uploading..." : "Upload"}
    </Button>

    {/* Fetch the images based on the current page */}
    <div className="flex flex-col gap-4 mt-5">
      {currentImages.length > 0
        ? currentImages.map((featureImgItem) =>
        (
          <div className="relative">
            <img
              src={featureImgItem.image}
              alt="Feature Image"
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
            <button onClick={() => setDeleteImageId(featureImgItem._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded"
            >
              x
            </button>

          </div>
        )
        )
        : <p>No images available.</p>}
    </div>

    <DeleteConfirmationModal
      isOpen={deleteImageId !== null}
      onClose={() => setDeleteImageId(null)}
      onConfirm={handleDeleteFeatureImage}
    />

    <div className="flex justify-between items-center mt-5">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-50">Previous
      </button>

      <p className="text-sm"> Page {currentPage} of {totalPages} </p>

      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50">Next
      </button>

    </div>



  </div>
}

export default AdminDashboard;