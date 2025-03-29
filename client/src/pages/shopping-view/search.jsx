import { ProductDetailsDialog } from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "@/context/SnackbarContext";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { resetSearchResults, getSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
    const [keyword, setKeyword] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const { searchResults } = useSelector((state) => state.shopSearch)
    const { user } = useSelector(state => state.auth)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productDetails } = useSelector((state) => state.shopProducts);
    console.log(" SearchProducts() productDetails===>", productDetails)
    const dispatch = useDispatch()
    const { showSnackbar } = useSnackbar();

    function handleGetProductDetails(getCurrentProductId) {
        console.log("getCurrentProductId====>", getCurrentProductId)
        dispatch(fetchProductDetails(getCurrentProductId));
        //alert("This is the product")
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

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true)

    }, [productDetails])

    useEffect(() => {
        console.log("keyword===>", keyword)
        if (keyword && keyword.trim() !== '' && keyword.length > 3) {
            // call api to search products
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))

            }, 1000)

        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResults())

        }

    }, [keyword])



    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input value={keyword} name={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        className="py-6" placeholder="Search for Products..." >
                    </Input>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    searchResults && searchResults.length ?
                        searchResults.map((item) => <ShoppingProductTile product={item} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart} />) :
                        <div>No Product found</div>
                }

            </div>
            {/* Best practice is to keep the dialog at the end */}

            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default SearchProducts;