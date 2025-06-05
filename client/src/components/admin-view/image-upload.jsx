import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { isValidFileType, isValidFileSize } from "@/utils/file-validation";
import { useSnackbar } from "@/context/SnackbarContext";
import axiosInstance from "@/api/axiosInstance";

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
  setImagePreview,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const { showSnackbar } = useSnackbar();

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    console.log("** handleImageFileChange selectedFiles **", selectedFiles);

    // Not feasible with the current backend implementation as the URL changes dynamically
    // If it is still required, need to store the hash value in the db & modify & validate in the backend
    // Checking duplicate isn't feasible

    // if (validFiles && validFiles.length > 0) {

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    // if(!error){
    // console.log("** Inside handleImageFileChange error **", error);
    setImageFile(selectedFiles);
    setCurrentImage(selectedFiles);
    setCurrentPreviewImage(previews);
  }
  console.log("** handleImageFileChange currentImage **", currentImage);
  console.log("** handleImageFileChange imageFileeeeee **", imageFile);
  console.log(
    "** handleImageFileChange currentPreviewImage **",
    currentPreviewImage
  );

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
      const formData = new FormData();
      console.log("** Inside uploadImageToCloudinary data **", formData);
      console.log("** Inside uploadImageToCloudinary **", imageFile);
      // data.append("my_file", imageFile[0]); // FormData object is created, and the file is appended under "my_file"
      // imageFile.forEach((file) => data.append("my_files", file));

      // Check if imageFile is an array and has files
      if (imageFile?.length > 0) {
        console.log(
          "** Inside uploadImageToCloudinary imageFile **",
          imageFile
        );
        // Loop through each file and validate before appending to FormData
        for (let file of imageFile) {
          console.log("** Inside uploadImageToCloudinary file **", file);
          if (isValidFileType(file) && isValidFileSize(file)) {
            console.log("** Just before append **", file);
            formData.append("my_files", file);

            console.log("** After append **", formData.getAll("my_files"));
          } else {
            showSnackbar({
              message:
                "Invalid file type or size. Only jpg, png, and jpeg files under 5 MB are allowed.",
              severity: "error",
            });
            setImageLoadingState(false);
            return;
          }
        }
      }

      if (formData.getAll("my_files").length > 0) {
        console.log(
          "** formData length **",
          formData.getAll("my_files").length
        );
        console.log("** Inside uploadImageToCloudinary dataaaaa **", formData);
        const response = await axiosInstance.post(
          "/admin/products/upload-images",
          formData,
          {
            // Fix : for passing the payload
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("response.data.files[0].url", response.data.files[0].url);
        if (!response.data || !response.data.files) {
          throw new Error("No files returned from the server");
        }
        setUploadedImageUrl(response.data.files);
        setError(false);
        showSnackbar({
          message: "Image(s) loaded successfully",
          severity: "success",
        });
        setImageLoadingState(false);
        setImageFile(null); // Clear the imageFile state after upload
        setCurrentPreviewImage(null); // Clear the preview images after upload
        setCurrentImage(null); // Clear the current image state after upload

      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(true);
      showSnackbar({
        message: "Error uploading image",
        severity: "error",
      });
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]); // it will re-run whenever imageFile changes.

  console.log("** OUTSIDE useEffect imageFile **", imageFile);

  useEffect(() => {
    if (!error && currentPreviewImage && currentImage && setImagePreview) {
      setImageFile(currentImage);
      setImagePreview(currentPreviewImage);
    }
  }, [currentPreviewImage, currentImage, error]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? `opacity-60` : ""
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
          />
        </div>

        {!imageFile || imageFile?.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={` ${
              isEditMode ? `cursor-not-allowed` : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />

            <span>Drag & drop (or) Click to upload an image</span>
          </Label>
        ) : (
          <div className="flex items-center">
            {imageLoadingState ? (
              <div className="flex items-center">
                <FileIcon className="w-8 text-primary mr-2 h-8" />
              </div>
            ) : (
              <Skeleton className="h-10 bg-gray-100" />
            )}

            <div className="flex flex-wrap gap-4 justify-center items-center">
              {imageFile &&
                imageFile.length > 0 &&
                imageFile?.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center"
                  >
                    {imagePreview?.length > 0 && (
                      <img
                        src={imagePreview[index]}
                        alt="Preview"
                        className="w-64 h-64 object-cover"
                      />
                    )}
                    <p className="text-lg">{file.name}</p>
                    <button
                      className="mt-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
