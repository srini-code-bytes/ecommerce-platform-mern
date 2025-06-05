import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  incrementPage,
  resetProducts,
} from "@/store/admin/products-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const { page, hasMore, status, productList } = useSelector(
    (state) => state.adminProducts
  );
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  // has the image : uploadedImageUrl
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  async function handleDelete(getCurrentProductId) {
    console.log("getCurrentProductId===>", getCurrentProductId);

    try {
      dispatch(deleteProduct(getCurrentProductId));
      console.log("without resetProducts");
      showSnackbar({
        message: "Product deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      showSnackbar({
        message: "Failed to delete the product.",
        severity: "error",
      });
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts(page));
    console.log("inside useEffect pageeeee****", page);
  }, [page]);

  useEffect(() => {
    return () => {
      // Reset the products state when the component unmounts
      dispatch(resetProducts());
    }
  }, [dispatch]);

  console.log("productList ===> ", productList);
  console.log("uploadedImageUrl ===>", uploadedImageUrl);

  const handleLoadMore = () => {
    dispatch(incrementPage());
  };

  async function onSubmit(event) {
    event.preventDefault();

    try {
      let data;

      if (currentEditedId !== null) {
        const payload = {
          ...formData,
          image: uploadedImageUrl?.[0]?.url,
        };
        data = dispatch(
          editProduct({ id: currentEditedId, formData: payload })
        );
        console.log(data, "** edit data **");
        setFormData(initialFormData);
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
      } else {
        data = dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl?.[0]?.url,
          })
        );
        console.log(data, "add");
        setOpenCreateProductsDialog(false);
        setImageFile(null);
        setFormData(initialFormData);
        showSnackbar({
          message: "Product added successfully!",
          severity: "success",
        });
      }

    } catch (error) {
      console.error("Product submit error:", error);
      showSnackbar({
        message: "Error adding a product",
        severity: "error",
      });
    }
  }

  console.log("formData", formData);

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="bg-black text-white px-4 py-2 rounded-[5px] hover:bg-gray-800"
        >
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          // To clear out the Add product form
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? `Edit Product` : "Add Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Save" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
      {status === "loading" && <div className="text-center">Loading...</div>}
      {hasMore && status !== "loading" && (
        <button
          onClick={handleLoadMore}
          className="bg-black text-white px-4 py-2 rounded-[5px] hover:bg-gray-800 mt-4"
        >
          Load More
        </button>
      )}
    </>
  );
};

export default AdminProducts;
