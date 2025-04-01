import DeleteConfirmationModal from "@/components/admin-view/delete-confirm-modal";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "@/context/SnackbarContext";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [imagePreview, setImagePreview] = useState([]); //For previewing the image
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [deleteImageId, setDeleteImageId] = useState("")
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const showImagesPerPage = 3;
  const allImages = featureImageList?.length > 0 && featureImageList?.flatMap((collection) => collection.images)
  const totalImages = allImages.length || 0;
  const totalPages = Math.ceil(totalImages / showImagesPerPage);
  const startIndex = (currentPage - 1) * showImagesPerPage;
  const currentImages = allImages.length > 0 && allImages.slice(startIndex, startIndex + showImagesPerPage);

  console.log("allImages", allImages)
  console.log("** featureImageList **", featureImageList)
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

  function handleUploadFeatureImages() {
    setImageLoadingState(true)
    console.log("** uploadedImageUrl **", uploadedImageUrl);
    dispatch(addFeatureImage(uploadedImageUrl))
      .then((data) => {
        console.log("handleUploadFeatureImages()", data);
        if (data?.payload?.success) {
          dispatch(getFeatureImages())
          showSnackbar({
            message : "Image(s) uploaded successfully",
            severity : "success"        
          })
          setImageFile([])
          setUploadedImageUrl([])
          setImagePreview([])
        }
        setImageLoadingState(false)
      }
      ).catch((error) => {
        console.log("Error uploading image:", error)
        setImageLoadingState(false)
      })

  }

  function handleDeleteFeatureImage() {
    if (!deleteImageId) return;
    // if(window.confirm("Are you sure to delete this image?")){

    setIsDeleting(true);
    console.log("deleteImageId", deleteImageId)
    dispatch(deleteFeatureImage(deleteImageId))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages())
          setDeleteImageId("");
          showSnackbar({
            message : "Image deleted successfully",
            severity : "success"            
          })

          if (currentPage > 1 && currentImages.length === 1) {
            setCurrentPage(currentPage - 1)
          }
        }
      })
      .catch((error) => {
        console.log("Error deleting image :", error)
      })
      .finally(() => {
        setDeleteImageId(null);
        setIsDeleting(false);
      })

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

  useEffect(() => {
    if (totalImages === 0) {
      setCurrentPage(1)
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  })

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
      imagePreview={imagePreview}
    />
{/* 
    {imagePreview && (
      <div className="relative mt-5">
        <img src={imagePreview} alt="Preview" className="w-full h-[300px] object-cover rounded-t-lg" />
        <button onClick={handleResetPreview} className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 
        rounded-full">x</button>
      </div>
    )} */}

    <Button onClick={handleUploadFeatureImages}
      className="bg-black text-white mt-5 w-full"
      disabled={imageLoadingState || uploadedImageUrl.length === 0}
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
              src={featureImgItem.url}
              alt="Feature Image"
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
            <button onClick={() => setDeleteImageId(featureImgItem.public_id)}
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
      isOpen={deleteImageId}
      onClose={() => setDeleteImageId("")}
      onConfirm={handleDeleteFeatureImage}
      isDeleting={isDeleting}
      setDeleteImageId={setDeleteImageId}
    />

    <div className="flex justify-between items-center mt-5">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-50">Previous
      </button>

      <p className="text-sm"> Page {currentPage} of {Math.max(1, totalPages)} </p>

      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50">Next
      </button>
    </div>
  </div>
}

export default AdminDashboard;