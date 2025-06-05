import DeleteConfirmationModal from "@/components/admin-view/delete-confirm-modal";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "@/context/SnackbarContext";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  // where does this variable imageFile go?
  // imageFile is used to store the file selected by the user for upload
  // uploadedImageUrl is used to store the URL of the uploaded image
  // imagePreview is used to show the preview of the image before uploading
  // imageLoadingState is used to show the loading state while the image is being uploaded
  
  const [imageFile, setImageFile] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [imagePreview, setImagePreview] = useState([]); //For previewing the image
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [deleteImageId, setDeleteImageId] = useState("")
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const currentPageFromRedux = useSelector((state => state.commonFeature.page));

  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);

  // const allImages = featureImageList?.length > 0 && featureImageList?.flatMap((collection) => collection)
  const { totalImages, totalPages } = useSelector((state) => state.commonFeature);
  const limit = 5; // always handle the limit in the frontend

  console.log("** featureImageList **", featureImageList)

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
          dispatch(getFeatureImages({currentPage,limit}))
          showSnackbar({
            message: "Image(s) uploaded successfully",
            severity: "success"
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
          dispatch(getFeatureImages({currentPage,limit}))
          setDeleteImageId("");
          showSnackbar({
            message: "Image deleted successfully",
            severity: "success"
          })

          if (currentPage > 1 && featureImageList.length === 1) {
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
    if(limit && currentPage){
      dispatch(getFeatureImages({currentPage,limit}))
    }
  }, [dispatch, currentPage, limit]
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
      setCurrentPage(currentPageFromRedux)
    }
  }, [totalImages, totalPages, currentPage, currentPageFromRedux])

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

    <Button onClick={handleUploadFeatureImages}
      className="bg-black text-white mt-5 w-full"
      disabled={imageLoadingState || uploadedImageUrl.length === 0}
    >
      {imageLoadingState ? "Uploading..." : "Upload"}
    </Button>

    <div className="flex flex-col gap-4 mt-5">
      {featureImageList.length > 0
        ? featureImageList.map((featureImgItem) =>
        (
          <div className="relative">
            <img
              src={featureImgItem.url}
              alt="Feature Image"
              className="w-full h-[500px] object-cover rounded-t-lg"
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