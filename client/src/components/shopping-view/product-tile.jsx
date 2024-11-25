import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "@/components/ui/badge";

function ShoppingProductTile({ product }) {
  console.log("Inside ShoppingProductTile===>");
  return (
    <Card className="w-full max-w-sm mx-auto rounded-[15px]">
      {/* <> */}
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.image}
            className="w-full h-[300px] object-cover rounded-[15px]"
          />
          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
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
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
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
        <CardFooter>
          <Button className="w-full"> Add to Cart</Button>
        </CardFooter>
      {/* <> */}
    </Card>
  );
}

export default ShoppingProductTile;
