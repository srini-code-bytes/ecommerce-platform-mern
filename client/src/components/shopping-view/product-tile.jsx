import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddToCart }) {
  console.log("Inside ShoppingProductTile===>");

  const { cartItems } = useSelector(state => state.shopCart)

  const filteredProduct = cartItems?.items?.find(item => item.productId === product?._id)
  const outOfStock = product?.totalStock === 0 || filteredProduct?.quantity === product?.totalStock
  const stockLeft = cartItems.length > 0 ? product?.totalStock - filteredProduct?.quantity : product?.totalStock

  return (
    <Card className="w-full max-w-sm mx-auto rounded-[15px]">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.image}
            className="w-full h-[300px] object-cover rounded-[15px]"
          />

          {
            outOfStock ?
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                Out of Stock
              </Badge>
              : product?.totalStock <= 9 ?
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                  {`${stockLeft} items left`}
                </Badge>
                : product?.totalStock >= 10 ?
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                    Sale
                  </Badge>
                  : null
          }

        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              {product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                {product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>

      </div>
      <CardFooter>
        {
          outOfStock ? 
            <Button disabled className="w-full bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200">
              Out of Stock
            </Button>
            :
            <Button onClick={() => handleAddToCart(product?._id)} className="w-full bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200">
              Add to Cart
            </Button>
        }
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
