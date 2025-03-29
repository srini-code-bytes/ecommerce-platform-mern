import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "@/context/SnackbarContext";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addProductReview, getProductReviews } from "@/store/shop/review-slice";

export function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState('')
  const [rating, setRating] = useState(0)

  console.log("productDetails====>", productDetails)

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.shopCart)
  const { reviews } = useSelector(state => state.shopReview)
  const { showSnackbar } = useSnackbar();

  console.log("cartItems====>", cartItems)

  const filteredProduct = cartItems?.items?.find(item => item.productId === productDetails?._id)
  const outOfStock = productDetails?.totalStock === 0 || filteredProduct?.quantity === productDetails?.totalStock

  console.log("filteredProduct====>", filteredProduct)

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getProductReviews(productDetails?._id))
    }
  }, [productDetails])

  console.log("*** reviews===>", reviews);

  function handleRatingChange(rating) {
    setRating(rating)
  }

  function handleAddReview() {
    dispatch(addProductReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      rating: rating,
      reviewMessage: reviewMsg
    })).then(data => {
      console.log("data====>", data)
      if (data?.payload?.success) {
        dispatch(getProductReviews(productDetails?._id))
        handleDialogClose()
        showSnackbar({
          message : "Review added successfully",
          severity : "success"
        })

      }
    })
  }

  function handleDialogClose() {
    setRating(0)
    setReviewMsg('')
    console.log("Inside handleDialogClose")
    setOpen(false);
    dispatch(setProductDetails()) // call method in store 
  }

  function handleAddToCart(getCurrentProductId) {


    console.log("handleAddToCart => getCurrentProductId ====>", getCurrentProductId)
    // Calling addToCart API
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then(
      data => {
        if (data?.payload?.success) {
          // Calling fetchCartItems API
          dispatch(fetchCartItems(user?.id))
          showSnackbar({
            message : "Product is added to cart",
            severity : "success"         
          })

        }
      }
    )
  }

  const averageRating = reviews && reviews.length > 0 ? reviews.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) / reviews.length : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-3xl mb-4 mt-5">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-4xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
            >
              {productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 mt-2">
              <StarRatingComponent rating={averageRating} />
              {/* <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" /> */}
            </div>
            <span className="text-muted-foreground">({averageRating.toFixed(1)})
            </span>
          </div>
          <div className="mt-5 mb-5">

            {
              outOfStock ?
                <Button disabled className="w-full bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200">
                  Out of Stock
                </Button>
                :
                <Button onClick={() => handleAddToCart(productDetails?._id)} className="w-full bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200">
                  Add to Cart
                </Button>
            }

          </div>
          <Separator className="bg-gray-200" />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4 mt-2">Reviews</h2>
            <div className="grid gap-6">
              {
                reviews && reviews.length > 0 ?
                  (
                    reviews?.map((review) => (
                      <div className="flex gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarFallback>{review?.userName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{review?.userName}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={review.rating} />
                          </div>
                          <p className="text-muted-foreground">
                            {review.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1> No reviews found </h1>
                  )
              }

            </div>

            <div className="mt-10 flex-col flex-gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input name="reviewMsg" value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..." />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""} className=" bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200 mt-2">Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
