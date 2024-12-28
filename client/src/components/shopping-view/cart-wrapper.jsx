import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";


function UserCartWrapper({ cartItems, setopenCartSheet }) {

    const navigate = useNavigate();

    const totalCartAmount = cartItems && cartItems.length > 0 ?
        cartItems.reduce((sum, currentItem) => sum + (
            currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price
        ) * currentItem?.quantity, 0)

        : 0



    console.log("cartItems====>", cartItems)

    return <SheetContent className="sm:max-w-md back bg-white">
        <SheetHeader>
            <SheetTitle>
                My Cart
            </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">{
            cartItems && cartItems.length > 0 ?
                cartItems.map(item => <UserCartItemsContent cartItem={item} />) : null
        }


        </div>

        <div className="mt-8 space-y-4">
            <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">${totalCartAmount}</span>
            </div>
        </div>



        <Button onClick={() => {
            navigate('/shop/checkout')
            setopenCartSheet(false)
        }} className="w-full bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200 mt-4">
            Checkout
        </Button>


    </SheetContent>

}

export default UserCartWrapper;