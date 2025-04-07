import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { isValidFileType, isValidFileSize } from "@/utils/file-validation";
import { useSnackbar } from "@/context/SnackbarContext";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  imagePreview,
  setImagePreview
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const { showSnackbar } = useSnackbar()

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    console.log("** handleImageFileChange selectedFiles **", selectedFiles)
    // const validFiles = selectedFiles.filter((file) => {
    //   if(!isValidFileType(file, allowedImageUploadFileTypes)) {
    //     console.log("** INVALIDDDDDD ** ");
    //     showSnackbar({
    //       message : "Invalid file type, only jpg, png & jpeg are allowed.",
    //       severity : "error"
    //     })
    //     return false;
    //   }
    //   if(!isValidFileSize(file, maxFileSize)){
    //     showSnackbar({
    //       message: "File exceeds 5 MB limit.",
    //       severity : "error"
    //     })
    //     return false;
    //   }
    //   return true;
    // })

    // Not feasible with the current backend implementation as the URL changes dynamically 
    // If it is still required, need to store the hash value in the db & modify & validate in the backend
    // Checking duplicate isn't feasible

    // if (validFiles && validFiles.length > 0) {

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    // if(!error){
    // console.log("** Inside handleImageFileChange error **", error);
    setImageFile(selectedFiles);
    setCurrentImage(selectedFiles);
    // setImagePreview(previews);
    setCurrentPreviewImage(previews);
    // }
    // }

  }
  console.log("** handleImageFileChange currentImage **", currentImage)
  console.log("** handleImageFileChange currentPreviewImage **", currentPreviewImage)

  // useEffect(() => {
  //   if(!error){
  //     setImageFile(selectedFiles);
  //     setImagePreview(previews);
  //   }
  // }, [error])

  function handleDragOver(event) {
    event.preventDefault(); // recommended

  }

  function handleRemoveImage(index) {
    // setImageFile(null); // clear state
    // if (inputRef.current) {
    //   inputRef.current.value = "";
    // }
    const updatedFiles = imageFile.filter((_, i) => i !== index);
    setImageFile(updatedFiles);

    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImagePreview(updatedPreviews);
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles) {
      setImageFile(droppedFiles);
    }
    console.log("** Inside handleDrop **", droppedFiles);
  }

  async function uploadImageToCloudinary() {
    if (!imageFile || imageFile.length == 0) {
      return;
    }
    setImageLoadingState(true);

    try {
      const data = new FormData();
      // data.append("my_file", imageFile); // FormData object is created, and the file is appended under "my_file"
      imageFile.forEach((file) => data.append("my_files", file));

      const response = await axios.post(
        "http://localhost:8080/api/admin/products/upload-images",
        data
      );
      // setUploadedImageUrl(response.data.result.url);
      console.log("response.data", response.data);
      setUploadedImageUrl(response.data.files)
      setError(false)
      showSnackbar({
        message: "Image(s) loaded successfully",
        severity: "success"
      })
      setImageLoadingState(false)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError(true)
      showSnackbar({
        message: "Error uploading image",
        severity: "error"
      })
      setImageLoadingState(false)
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      // if (currentImage) {
      console.log("** Inside useEffect **", imageFile);
      uploadImageToCloudinary();
    }
  }, [imageFile]); // it will re-run whenever imageFile changes.

  useEffect(() => {
    if (!error && currentPreviewImage && currentImage) {
      setImageFile(currentImage);
      setImagePreview(currentPreviewImage);
    }

  }, [currentPreviewImage, currentImage, error])

  return (
    <div className={`w-full mt-4 ${isCustomStyling ?
      '' : 'max-w-md mx-auto'
      }`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? `opacity-60` : ""
          }border-2 border-dashed rounded-lg p-4`}
      >
        <div>
          <Input
            id="image-upload"
            type="file"
            multiple
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode}
          />
        </div>

        {imageFile.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={` ${isEditMode ? `cursor-not-allowed` : ""
              } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />

            <span>Drag & drop to upload an image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              {imageFile.map((file, index) => (
                <div key={index} className="flex flex-col items-center justify-center">

                  <img src={imagePreview[index]} alt="Preview" className="w-64 h-64 object-cover" />
                  <p className="text-lg">{file.name}</p>
                  <button className="mt-2 text-red-500 hover:text-red-700" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
