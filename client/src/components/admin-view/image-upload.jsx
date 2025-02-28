import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  setImagePreview
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    console.log("** Inside handleImageFileChange **");
    console.log(event.target.files);
    const selectedFile = event.target.files?.[0];
    console.log("** Inside handleImageFileChange selectedFile **", selectedFile);
    if (selectedFile) {
      setImageFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile))
    }
      
  }

  function handleDragOver(event) {
    event.preventDefault(); // recommended
  }

  function handleRemoveImage() {
    setImageFile(null); // clear state
    if (inputRef.current) {
      // clear ref
      inputRef.current.value = "";
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
    }
    console.log("** Inside handleDrop **", droppedFile);
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile); // FormData object is created, and the file is appended under "my_file"
    try{
      const response = await axios.post(
        "http://localhost:8080/api/admin/products/upload-image",
        data
      );
      console.log("response.data", response.data);
      if (response.data.success) {
        setUploadedImageUrl(response.data.result.url);
      } else {
        console.error("Error uploading image:", response.data)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setImageLoadingState(false)
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]); // it will re-run whenever imageFile changes.

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
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode}
          />
        </div>

        {!imageFile ? (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
