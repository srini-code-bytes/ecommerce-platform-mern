# react-learning-ecommerce
Build a full stack E-Commerce application from scratch using MERN Stack.

#Upload Image to Cloudinary

Frontend:

1. The user selects an image file (imageFile), which triggers uploadImageToCloudinary() via the useEffect hook. (i.e) React will know this when the state of imageFile changes, thereby triggering useEffect()
2. The FormData object is created, and the file is appended under "my_file".
3. The image is sent in a POST request to the backend.

Backend:

Route Handling: The /products/upload-image endpoint receives the request, with upload.single("my_file") (multer) handling the file and attaching it to req.file.
Controller Processing: The handleImageUpload function converts the file to a base64-encoded string, uploads it to Cloudinary, and sends back the resulting URL and metadata in the response.
Response Handling:
The frontend receives the response, logs it, and updates the state with setUploadedImageUrl(response.data), making the image URL available for display or further use.