import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete
}) {
  console.log("product====>", product)
  return (
    <Card className="relative overflow-hidden hover:scale-105 transition-transform duration-300 group shadow-lg">
      <img
        src={product?.image}
        alt={product?.title || "Product Image"}
        className="w-full h-[700px] object-cover bg-white"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
        <CardContent>
          <h2 className="text-white text-lg font-bold">{product?.title}</h2>
          <div className="flex justify-between items-center text-white">
            <span className={`${product?.salePrice ? "line-through" : ""}`}>
              ${product.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="font-semibold">${product.salePrice}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="bg-white text-black hover:bg-gray-300 hover:text-black border border-black hover:shadow-md transition"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete(product?._id)}
            className="bg-white text-black hover:bg-gray-300 hover:text-black border border-black hover:shadow-md transition">
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>

  );
}

export default AdminProductTile;
