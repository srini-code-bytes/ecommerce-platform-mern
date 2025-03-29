import ProductFilter from "@/components/shopping-view/filter";
import { ProductDetailsDialog } from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useSnackbar } from "@/context/SnackbarContext";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      // note that the commas are encoded as %2C
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();

  // shopProducts -- check in store
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  // why?
  const { user } = useSelector(state => state.auth)
  
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { showSnackbar } = useSnackbar();

  const categorySearchParam = searchParams.get("category");
  console.log("categorySearchParam===>", categorySearchParam)

  function handleSort(value) {
    console.log("Inside handleSort()", value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    console.log(
      "getSectionId, getCurrentOption",
      getSectionId,
      getCurrentOption
    );

    //check if current index of the section is present or not

    let copyFilters = { ...filters };
    console.log("filters====>", filters, searchParams);
    console.log("searchParams====>", searchParams);
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    // if no filter is added for that category
    if (indexOfCurrentSection == -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        copyFilters[getSectionId].indexOf(getCurrentOption);
      console.log("indexOfCurrentOption===>", indexOfCurrentOption);
      if (indexOfCurrentOption == -1) {
        // If multiple checkboxes are checked on the UI
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    console.log("copyFilters=====>", copyFilters);
    setFilters(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log("getCurrentProductId====>", getCurrentProductId)
    dispatch(fetchProductDetails(getCurrentProductId));
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
            message: "Product is added to cart",
            severity: "success"
          })
        }
      }
    )
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)

  }, [productDetails])

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);
  // refresh the page when the category changes

  useEffect(() => {
    if(categorySearchParam === "products"){
      dispatch(fetchAllFilteredProducts({ sortParams: sort }));
    }
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null && categorySearchParam !== "products")
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })); //Shopping view
  }, [dispatch, sort, filters]);

  console.log("productDetails===>", productDetails);
  console.log("productList===>", productList);
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold mr-2">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    // Holding the data that we chose
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
              <ShoppingProductTile handleGetProductDetails={handleGetProductDetails} product={productItem} handleAddToCart={handleAddToCart} />
            ))
            : null}
        </div>
      </div>
      {/* export function ProductDetailsDialog({ open, setOpen, productDetails }) { */}
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingListing;
